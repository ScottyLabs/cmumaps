# this script is used to convert the svg file to a geojson file.
# It uses svg_to_geojson.py to convert the svg file to a geojson file.
# then it uses reverts the y coordinate to make the polygon face up.
# then it uses simplify_geojson.py to simplify the geojson file.
# then it uses remove_duplicate_polygon.py to remove the duplicate polygon.

from bs4 import BeautifulSoup
from svgpathtools import parse_path
import geojson
from shapely.geometry import shape, mapping

file_name = "map.svg"


def svg_path_to_coords(svg_d, num_points=100):
    path = parse_path(svg_d)
    coords = []
    for seg in path:
        # Sample points along each segment
        for i in range(num_points + 1):
            pt = seg.point(i / num_points)
            coords.append((pt.real, pt.imag))
    return coords


# Load SVG file
with open(file_name, "r") as f:
    soup = BeautifulSoup(f, "xml")

# Extract all <path> elements
paths = soup.find_all("path")

features = []

for i, path in enumerate(paths):
    d = path.get("d")
    if not d:
        continue
    coords = svg_path_to_coords(d)

    # Close the polygon if not already closed
    if coords[0] != coords[-1] and ((coords[0][0] - coords[-1][0])**2 + (coords[0][1] - coords[-1][1])**2)**0.5 > 1:
        # coords.append(coords[0])
        continue
    # print(i)
    polygon = geojson.Polygon([coords])
    feature = geojson.Feature(geometry=polygon, properties={"id": i})
    features.append(feature)


# Wrap as a FeatureCollection
gj = geojson.FeatureCollection(features)

print("convert to .geojson")

# Revert the GeoJSON

# Compute the minimum FLIPPED Y over all features
# min_flipped = float("inf")
# for feat in gj["features"]:
#     # assume Polygon with one outer ring:
#     ring = feat["geometry"]["coordinates"][0]
#     for x, y in ring:
#         flipped = -y
#         if flipped < min_flipped:
#             min_flipped = flipped

# Rewrite every coordinate: flip and then subtract min_flipped
for feat in gj["features"]:
    ring = feat["geometry"]["coordinates"][0]
    new_ring = []
    for x, y in ring:
        y_flipped = -y
        new_ring.append((x, y_flipped))
    feat["geometry"]["coordinates"][0] = new_ring

print("revert the .geojson")
# Simplify the GeoJSON


def is_colinear(p1, p2, p3, tol=1e-6):
    """
    Return True if p1, p2, p3 are (approximately) colinear.
    Uses the cross-product test with a small tolerance.
    """
    x1, y1 = p1
    x2, y2 = p2
    x3, y3 = p3
    return abs((x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1)) < tol


def simplify_ring(ring):
    """
    Remove any intermediate points in straight segments.
    Properly handles closed rings (first == last).
    """
    # 1) Detect & strip the closing duplicate
    closed = ring[0] == ring[-1]
    coords = ring[:-1] if closed else ring[:]

    if len(coords) <= 2:
        # Nothing to simplify
        return ring

    simplified = [coords[0]]
    for i in range(1, len(coords) - 1):
        p1 = simplified[-1]
        p2 = coords[i]
        p3 = coords[i + 1]

        # Drop p2 if it lies on the line p1→p3
        if not is_colinear(p1, p2, p3):
            simplified.append(p2)

    # Always keep the last “real” point
    simplified.append(coords[-1])

    # Re-close if it was closed
    if closed:
        simplified.append(simplified[0])

    return simplified


for feature in gj["features"]:
    ring = feature["geometry"]["coordinates"][0]
    feature["geometry"]["coordinates"][0] = simplify_ring(ring)

print("remove colinear points")


def normalize_polygon(polygon):
    # Sort the coordinates to ensure consistent order
    return tuple(sorted(map(tuple, polygon)))


def enforce_winding_order(polygon):
    # Use shapely to ensure the polygon has the correct winding order
    shapely_polygon = shape({"type": "Polygon", "coordinates": [polygon]})
    return mapping(shapely_polygon)["coordinates"][0]


def remove_duplicate_polygons(geojson_data):
    feature_collection = {"type": "FeatureCollection", "features": []}
    unique_polygons_id = dict()
    unique_polygons = []

    for feature in geojson_data["features"]:
        if feature["geometry"]["type"] == "Polygon":
            polygon = feature["geometry"]["coordinates"][0]
            # Enforce winding order
            polygon = enforce_winding_order(polygon)
            # Round coordinates to 6 decimal places and normalize
            rounded_polygon = [(round(lon, 6), round(lat, 6)) for lon, lat in polygon]
            polygon_tuple = normalize_polygon(rounded_polygon)

            unique_polygons_id[polygon_tuple] = feature["properties"]["id"]

    unique_polygons_id = list(map(lambda x: x[1], unique_polygons_id.items()))
    cnt = 0
    for feature in geojson_data["features"]:
        if feature["properties"]["id"] in unique_polygons_id:
            ans = feature.copy()
            ans["properties"]["id"] = cnt
            unique_polygons.append(ans)
            cnt += 1
    print(f"there are {len(unique_polygons)} unique polygons")
    feature_collection["features"].extend(unique_polygons)
    return feature_collection


geojson_data_no_duplicates = remove_duplicate_polygons(gj)
# 4) Save out the corrected GeoJSON
with open(file_name.replace(".svg", "_simplified1.geojson"), "w") as f:
    geojson.dump(geojson_data_no_duplicates, f)

print("remove duplicate polygons")
