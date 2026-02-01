"""Upload all floorplan SVG files to S3."""

from pathlib import Path

from s3_utils import upload_generic_file

# Path to local floorplan_svg folder
LOCAL_SVG_FOLDER = Path("floorplan_svg")
# S3 destination path
S3_DESTINATION = "floorplan_svg"


def upload_all_svg_files() -> None:
    """Upload all SVG files from floorplan_svg folder to S3."""
    success_count = 0
    fail_count = 0

    # Iterate through building folders
    for building_path in LOCAL_SVG_FOLDER.iterdir():
        # Skip if not a directory
        if not building_path.is_dir():
            continue

        building = building_path.name

        # Iterate through SVG files in building folder
        for svg_file in building_path.iterdir():
            if svg_file.suffix != ".svg":
                continue

            s3_object_name = f"{S3_DESTINATION}/{building}/{svg_file.name}"

            success = upload_generic_file(
                str(svg_file),
                s3_object_name,
                file_type="svg+xml",
            )

            if success:
                success_count += 1
            else:
                fail_count += 1

    print(f"\nUpload complete: {success_count} succeeded, {fail_count} failed")  # noqa: T201


if __name__ == "__main__":
    upload_all_svg_files()
