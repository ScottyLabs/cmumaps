#!/usr/bin/env python3
"""
Script to download all JSON files from S3 bucket while maintaining directory structure
"""

from pathlib import Path
from s3_utils import download_json_file, list_json_files

DOWNLOAD_DIR = Path(__file__).parent.parent / "s3_downloads"

def main():
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Download directory: {DOWNLOAD_DIR}\n")

    json_files = list_json_files()

    if not json_files:
        print("No JSON files found in bucket")
        return

    print(f"\nDownloading {len(json_files)} files...\n")

    for file_info in json_files:
        s3_object_name = file_info["name"]

        local_file_path = DOWNLOAD_DIR / s3_object_name #keeps s3 file structure
        local_file_path.parent.mkdir(parents=True, exist_ok=True)
        
        download_json_file(s3_object_name, str(local_file_path))


if __name__ == "__main__":
    main()
