import xml.etree.ElementTree as ET
import json
from shapely.geometry import Point, Polygon
import geojson
from shapely.ops import nearest_points
from matplotlib.cm import get_cmap


class Room:
    def __init__(self, name, coordinates):
        self.name = name
        self.coordinates = coordinates


class Poly:
    def __init__(self, id, coordinates):
        self.id = id
        self.coordinates = coordinates


def parse_svg(svg_file):
    tree = ET.parse(svg_file)
    root = tree.getroot()
    namespaces = {"svg": "http://www.w3.org/2000/svg"}

    room_tags = []
    for text in root.findall(".//svg:text", namespaces):
        # Extract the room name from the text content
        room_name = text.text.strip()
        # Extract the coordinates from the attributes
        x = float(text.get("x"))
        y = -float(text.get("y"))
        room = Room(room_name, (x, y))
        room_tags.append(room)

    return room_tags


def parse_geojson(geojson_file):
    with open(geojson_file) as f:
        data = json.load(f)

    polygons = []
    for feature in data["features"]:
        polygon = feature["geometry"]["coordinates"][0]
        polygon_id = feature["properties"]["id"]
        polygon = Poly(polygon_id, polygon)
        polygons.append(polygon)

    return polygons


target_polygon = set([152, 38, 311])


def match_rooms_to_polygons(room_tags, polygons):
    matches = []
    for room in room_tags:
        point = Point(room.coordinates)
        for i in range(len(polygons)):
            polygon_coords = polygons[i].coordinates
            p = Polygon(polygon_coords)
            if p.contains(point):
                matches.append({"polygon": polygons[i], "room": room})
                break
    return matches


# Example usage
room_tags = parse_svg("map.svg")
room_tags.sort(key=lambda room: room.name)
polygons = parse_geojson("map_simplified1.geojson")
assert len(room_tags) == len(polygons)

# # Create GeoJSON features for polygons
# polygon_features = []
# for i, polygon_coords in enumerate(polygons):
#     polygon = geojson.Polygon(polygon_coords)
#     feature = geojson.Feature(geometry=polygon, properties={"id": i})
#     polygon_features.append(feature)

matches = match_rooms_to_polygons(room_tags, polygons)

match_room = set()
# print(target_polygon)
for match in matches:
    match_room.add(match["room"])
duplicated_polygon = set()
match_polygon = set()
for match in matches:
    cur_p = match["polygon"]
    if cur_p in match_polygon:
        # print(f"polygon {cur_p.id} is matched to multiple rooms")
        duplicated_polygon.add(cur_p)
    match_polygon.add(cur_p)
# print(f"match room {len(match_room)}")
# print(f"match polygon{len(match_polygon)}")

duplicated_room = set()
id_to_room = dict()
name_to_id = dict()
for match in matches:
    cur_p = match["polygon"]
    if cur_p in duplicated_polygon:
        duplicated_room.add(match["room"])
        name_to_id[match["room"].name] = cur_p
        if cur_p.id in id_to_room:
            id_to_room[cur_p.id].append(match["room"])
        else:
            id_to_room[cur_p.id] = [match["room"]]
n_duplicated_polygon = len(duplicated_polygon)
n_duplicated_room = len(duplicated_room)
# print(f"Number of duplicated polygons: {len(duplicated_polygon)}")
# print(f"Number of duplicated rooms: {len(duplicated_room)}")

unmatched_room = [room for room in room_tags if room not in match_room]

# # Find indices of polygons that are not matched
unmatched_polygons = [polygon for polygon in polygons if polygon not in match_polygon]
n_unmatched_room = len(unmatched_room)
n_unmatched_polygons = len(unmatched_polygons)
# print(f"Number of unmatched rooms: {len(unmatched_room)}")
# print(f"Number of unmatched polygons: {len(unmatched_polygons)}")
print(len(matches))

assert (
    n_duplicated_room + n_unmatched_room == n_duplicated_polygon + n_unmatched_polygons
)

# TODO: get rooms matches with polygons, for all rooms and polygon. Sort based on distance.
# If an unmatched polygon is matched with a room, remove room from duplicated if necessary. Match all eventually.

# Function to calculate distance between a point and a polygon


def calculate_distance(point, polygon):
    point_geom = Point(point)
    polygon_geom = Polygon(polygon)
    nearest_geom = nearest_points(point_geom, polygon_geom)[1]
    return point_geom.distance(nearest_geom)


for room in unmatched_room:
    room_point = Point(room.coordinates)
    distances = []
    for polygon in unmatched_polygons:
        polygon_coords = polygon.coordinates
        distance = calculate_distance(room_point, polygon_coords)
        distances.append((distance, polygon))
    # Sort by distance
    distances.sort(key=lambda x: x[0])
    # Match the closest polygon
    closest_polygon = distances[0][1]
    matches.append({"room": room, "polygon": closest_polygon})
    # Update matched sets
    # Remove matched room and polygon from unmatched lists
    unmatched_polygons.remove(closest_polygon)

for polygon in unmatched_polygons:
    # print(len(duplicated_room))
    polygon_coords = polygon.coordinates
    distances = []
    for room in duplicated_room:
        room_point = Point(room.coordinates)
        distance = calculate_distance(room_point, polygon_coords)
        distances.append((distance, room))
        # print(room.name)
    distances.sort(key=lambda x: x[0])
    # print(distances)
    closest_room = distances[0][1]
    # print(f"closest room: {closest_room.name}")
    matches.append({"room": closest_room, "polygon": polygon})
    duplicated_room.remove(closest_room)
    pid = name_to_id[closest_room.name].id
    matches.remove({"room": closest_room, "polygon": name_to_id[closest_room.name]})
    id_to_room[pid].remove(closest_room)
    if len(id_to_room[pid]) == 1:
        duplicated_room.remove(id_to_room[pid][0])

for match in matches:
    print(f"room {match['room'].name} is matched with polygon {match['polygon'].id}")
print(len(room_tags))
print(len(polygons))
assert len(room_tags) == len(matches)


def index_to_color(index, total):
    """
    Convert an index to a color using a colormap from matplotlib.

    Parameters:
    - index: The index to convert.
    - total: The total number of indices.

    Returns:
    - A color in hexadecimal format.
    """
    import matplotlib.colors as mcolors

    # Use a more vibrant colormap from matplotlib
    colormap = get_cmap("plasma")
    # Normalize the index to be between 0 and 1
    normalized_index = index / total * 2
    # Get the color from the colormap
    color = colormap(normalized_index)
    # Convert the color to hexadecimal
    hex_color = mcolors.to_hex(color)
    return hex_color


polygon_features = []
for polygon in polygons:
    p = geojson.Polygon([polygon.coordinates])
    for index, match in enumerate(matches):
        if match["polygon"].id == polygon.id:
            color = index_to_color(index, len(matches))
            break
    feature = geojson.Feature(geometry=p, properties={"id": polygon.id, "color": color})
    polygon_features.append(feature)
print(f"Number of polygon features: {len(polygon_features)}")

# # Create GeoJSON features for room tags
room_features = []
for i, room in enumerate(room_tags):
    for index, match in enumerate(matches):
        if match["room"].name == room.name:
            color = index_to_color(index, len(matches))
            break
    point = geojson.Point(room.coordinates)
    feature = geojson.Feature(
        geometry=point, properties={"name": room.name, "color": color}
    )
    room_features.append(feature)

# Combine room and polygon features into a single FeatureCollection
combined_features = room_features + polygon_features
feature_collection = geojson.FeatureCollection(combined_features)

# Save to GeoJSON
with open("double_counted_polygon.geojson", "w") as f:
    geojson.dump(feature_collection, f)

print("Saved room tags and polygons to rooms_and_polygons.geojson")


# map room name with function name
