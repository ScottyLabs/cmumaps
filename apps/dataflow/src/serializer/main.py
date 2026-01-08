# python floorplans/serializer/main.py <Optional file_to_serialize> <Optional floor_code>
import sys
import argparse
from placements import placements_serializer
from buildings import buildings_serializer
from floorplans import floorplans_serializer
from all_graph import all_graph_serializer

# Create buildings.json using Building and Floor table
# Create all-graph.json using Edge and Node table
# Create floorplans.json using Alias and Room table
# Create placements.json using Floor table


def main():
    parser = argparse.ArgumentParser(
        description="A script to serialize different parts of floorplan data.",
        formatter_class=argparse.RawTextHelpFormatter,  # For better help text formatting
    )

    parser.add_argument(
        "serializer",
        nargs="?",  # The argument is optional
        choices=["placements", "buildings", "floorplans", "all-graph", "all"],
        default="all",
        help=(
            "The name of the serializer to run.\n"
            "  - placements: Serializes placement data.\n"
            "  - buildings:  Serializes building data.\n"
            "  - floorplans: Serializes all floorplans OR a specific one if floor_code is provided.\n"
            "  - all-graph:  Serializes the graph data.\n"
            "  - all:        (Default) Runs all serializers."
        ),
    )
    parser.add_argument(
        "floor_code",
        nargs="?",  # The argument is optional
        default=None,
        help="Optional: The specific floor code (e.g., 'GH-1') to serialize. Only valid with the 'floorplans' serializer.",
    )

    args = parser.parse_args()

    if args.floor_code and args.serializer != "floorplans":
        parser.error(
            "The 'floor_code' argument can only be used with the 'floorplans' serializer."
        )
        sys.exit(1)

    if args.serializer == "floorplans":
        if args.floor_code:
            print(f"Serializing ONLY floor '{args.floor_code}'...")
            floorplans_serializer(args.floor_code)
            print("Serialized specific floorplan data into floorplans-serialized.json!")
        else:
            print("Serializing all floorplan data...")
            floorplans_serializer()
            print("Serialized all floorplans.json into floorplans-serialized.json!")

    elif args.serializer == "placements":
        print("Serializing placements data...")
        placements_serializer()
        print("Serialized placements.json into placements-serialized.json!")

    elif args.serializer == "buildings":
        print("Serializing buildings data...")
        buildings_serializer()
        print("Serialized buildings.json into buildings-serialized.json!")

    elif args.serializer == "all-graph":
        print("Serializing all-graph data...")
        all_graph_serializer()
        print("Serialized all-graph.json into all-graph-serialized.json!")

    elif args.serializer == "all":
        print("Running all serializers...")
        placements_serializer()
        print("Serialized placements.json into placements-serialized.json!")
        buildings_serializer()
        print("Serialized buildings.json into buildings-serialized.json!")
        floorplans_serializer()
        print("Serialized floorplans.json into floorplans-serialized.json!")
        all_graph_serializer()
        print("Serialized all-graph.json into all-graph-serialized.json!")
        print("\nAll serialization tasks are complete!")


if __name__ == "__main__":
    main()
