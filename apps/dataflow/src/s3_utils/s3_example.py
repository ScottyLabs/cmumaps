#!/usr/bin/env python3
"""
Example script demonstrating how to download and work with JSON files from S3
"""

from s3_utils import (
    download_json_file,
    get_json_from_s3,
    list_json_files,
    list_bucket_objects,
)


def main():
    print("=== S3 JSON Download Example ===\n")

    # 1. List all objects in the bucket
    print("1. All objects in bucket:")
    list_bucket_objects()

    # 2. List only JSON files
    print("\n2. JSON files only:")
    json_files = list_json_files()
    print(f"Found {len(json_files)} JSON files in the bucket")

    # 3. Download a specific JSON file to local storage
    print("\n3. Downloading buildings.json to local file:")
    success = download_json_file(
        "floorplans/buildings.json", "downloaded_buildings.json"
    )

    if success:
        print("File downloaded successfully!")

    # 4. Get JSON data directly into memory (without saving to file)
    print("\n4. Getting JSON data directly into memory:")
    buildings_data = get_json_from_s3("floorplans/buildings.json", return_data=True)

    if buildings_data:
        print(f"Retrieved buildings data with {len(buildings_data)} buildings")

        # Show some sample data
        if isinstance(buildings_data, list) and len(buildings_data) > 0:
            first_building = buildings_data[0]
            print(f"   First building: {first_building.get('name', 'Unknown')}")
        elif isinstance(buildings_data, dict):
            print(f"   Data keys: {list(buildings_data.keys())}")

    # 5. Get raw response object (useful for streaming large files)
    print("\n5. Getting raw response object:")
    response = get_json_from_s3("floorplans/placements.json", return_data=False)

    if response:
        print("Got response object")
        response.close()  # Important to close the response

    print("\n=== Example completed ===")


if __name__ == "__main__":
    main()
