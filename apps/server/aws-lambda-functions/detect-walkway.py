import copy
import json
import uuid
from sklearn.cluster import KMeans  # type: ignore
import networkx as nx  # type: ignore
from shapely.geometry import shape, Point  # type: ignore
import numpy as np


# Get a sample of points within a polygon
def sample_points(polygon):
    bounding_box = polygon.envelope.exterior.coords
    min_x, min_y, max_x, max_y = (
        bounding_box[0][0],
        bounding_box[0][1],
        bounding_box[2][0],
        bounding_box[2][1],
    )
    res_x, res_y = (
        (max_x - min_x) / 50,
        (max_y - min_y) / 50,
    )  # 50 is the number of points per axis.  This is not a perfect way of doing this (think thin hallways)
    points = [
        (x, y)
        for x in np.arange(min_x, max_x, res_x)
        for y in np.arange(min_y, max_y, res_y)
        if Point(x, y).within(polygon)
    ]
    return points


def isFullyConnected(edges, max):
    graph = nx.Graph()
    graph.add_nodes_from(range(max))
    graph.add_edges_from(edges)
    return nx.is_connected(graph)


def generate_graphs(room_id, room, density):
    area = shape(room["polygon"]).area
    complexity = density / (
        1 / len(room["polygon"]["coordinates"][0]) + 200 / area
    )  # weighted harmonic mean of num points and area

    complexity = max(complexity, 1)

    samples = sample_points(shape(room["polygon"]))

    n_cls = int(complexity)
    clustering = KMeans(n_clusters=n_cls)
    clustering.fit(samples)

    centers = copy.deepcopy(clustering.cluster_centers_)
    edges = []
    lo = max(
        [
            min([np.linalg.norm(centers[i] - centers[j]) for j in range(len(centers))])
            for i in range(len(centers))
        ]
    )
    hi = max(
        [
            max([np.linalg.norm(centers[i] - centers[j]) for j in range(len(centers))])
            for i in range(len(centers))
        ]
    )
    med = (lo + hi) / 2
    old_med = 0
    while abs(med - old_med) > 1:
        med = (lo + hi) / 2
        edges = []
        for i in range(len(centers)):
            for j in range(i + 1, len(centers)):
                if np.linalg.norm(centers[i] - centers[j]) < med:
                    edges.append((i, j))
        if isFullyConnected(edges, len(centers)):
            hi = med + 0.01  # This incentivizes connectivity
        else:
            lo = med
        old_med = med
        med = (lo + hi) / 2
    radius = med

    ID_list = []

    nodes = dict()
    for i in range(len(centers)):
        center = centers[i]
        curID = str(uuid.uuid4())
        ID_list.append(curID)
        newNode = dict()
        newNode["pos"] = dict()
        newNode["pos"]["x"] = round(center.tolist()[0], 2)
        newNode["pos"]["y"] = round(center.tolist()[1], 2)

        neighbors = dict()
        for j in range(0, i):
            dist = np.linalg.norm(centers[i] - centers[j])
            if dist < radius:
                otherID = ID_list[j]

                curEdge = dict()
                curEdge["dist"] = round(dist, 2)

                neighbors[otherID] = curEdge
                nodes[otherID]["neighbors"][curID] = curEdge

        newNode["neighbors"] = neighbors

        newNode["roomId"] = room_id
        nodes[curID] = newNode

    return nodes


def lambda_handler(event, context):
    try:
        body = json.loads(event["body"])
        room_id = body["roomId"]
        room = body["room"]
        density = body["density"]
        output = generate_graphs(room_id, room, density)
        return {"statusCode": 200, "body": json.dumps({"nodes": output})}
    except Exception as e:
        return {"statusCode": 400, "body": json.dumps({"error": str(e)})}
