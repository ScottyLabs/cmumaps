# CMU Maps Data

## Overview

This directory is responsible for handling data flow for CMU Maps. Check the
scripts section in `pyproject.toml` for the available commands. You can run a
script using the following command:

```zsh
uv run --env-file <ENV_FILE> <SCRIPT_NAME>
```

## Local database import

Start the devcontainer and backend using the [running guide](../../docs/src/Setup.md).
Then, from the repository root on the host (use `py -3` in Windows PowerShell):

```sh
python3 scripts/dev/dev.py upload "uploads/Data/cmumaps-data/floorplans"
python3 scripts/dev/dev.py populate --check
python3 scripts/dev/dev.py populate
```

The upload folder must contain `buildings.json`, `floorplans.json`,
`placements.json`, and `all-graph.json`. Import validates these datasets and
backend authorization before clearing the seven map tables. POIs are left empty
unless `--include-pois` is supplied and `osm-pois.json` is available. Restart the
backend after import to refresh its search and graph caches. A failure after the
reset can leave a partial import; the whole operation is not transactional.

The local helper loads service-account credentials from the server env file and
uses local Garage's S3 variables. The client needs `/projects/maps/admins` in its
Keycloak access token. It uses the minimal `populate` dependency group rather than
installing the entire scraper/geometry toolchain. For standalone environments,
configure `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, optional `S3_BUCKET` and
`S3_REGION`, `SERVER_URL`, `AUTH_CLIENT_ID`, `AUTH_CLIENT_SECRET`, and `AUTH_ISSUER`.
The script's `--local` mode enforces the development Garage endpoint and local API.

## Validation

With Python 3.12+ and uv available, run from this directory:

```sh
uv sync --locked --only-group populate --group dev
PYTHONPATH=src uv run --no-sync python -m unittest discover -s tests -v
PYTHONPATH=src uv run --no-sync python -c "from linter import main; main()"
```

The shell assignment above is for Linux/macOS or a container shell. For the host
launcher's platform-independent tests, see the main running guide.

## _25live

`_25live/` directory contains the code for processing data from the 25live data
from the [event-scraper](https://github.com/ScottyLabs/event-scraper) s3 bucket
and populating the database with the data.

## Cleaner

`cleaner/` is responsible for archiving one-time scripts for cleaning data.

## Clients

`clients/` contains the clients for interacting with the CMU Maps API and S3 bucket.

## Deserializer

`deserializer/` is responsible for deserializing the JSON files from the S3 bucket
and populating the database with the data.

## Linter

`linter/` exists to enable the `lint` script in `pyproject.toml`.

## Logger

`logger/` contains the logging module for the dataflow application.

## Processor

`processor/` is responsible for processing the scraped floorplan data.

### Generator

`processor/generator/` is responsible for generating the floorplan data from the
scraped data.

### Merger

`processor/merger/` is responsible for merging the scraped data into the
existing floorplan data.

## Scraper

`scraper/` is responsible for scraping floorplan data from various sources and
uploading it to the S3 bucket

### ESIM

`scraper/esim/` is responsible for scraping building data from the ESIM website.

### FMS

`scraper/fms/` is responsible for scraping floorplan data from the FMS website.

### OSM

`scraper/osm/` is responsible for scraping graph data from the OSM website.

## Serializer

`serializer/` is responsible for serializing data from the database to JSON files.

## Additional Information

See the [Data Flow documentation](../../docs/src/Data-Flow.md)
for more information.
