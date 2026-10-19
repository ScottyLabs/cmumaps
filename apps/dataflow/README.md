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
The host launcher downloads CDN settings from OpenBao into this app's ignored env
files. From the repository root (use `py -3` in Windows PowerShell):

```sh
python3 scripts/dev/dev.py secrets
python3 scripts/dev/dev.py populate --check
python3 scripts/dev/dev.py populate
```

By default this reads `floorplans/buildings.json`, `floorplans/floorplans.json`,
`floorplans/placements.json`, and `floorplans/all-graph.json` from the allocated
hosted CDN bucket (`cdn-maps`). It uses S3 credentials, not the public CDN URL, and
writes only through the local backend API. The storage settings override inherited
Garage variables. The importer does not upload to or modify hosted storage.

Import validates datasets and backend authorization before clearing the seven
local map tables. POIs are left empty unless `--include-pois` is supplied and
`floorplans/osm-pois.json` exists. Restart the backend after import to refresh
search and graph caches. A failure after reset can leave a partial import; the
whole operation is not transactional. Raw `source-fetch/` artifacts are not the
processed datasets required by this importer.

For isolated experiments, `dev.py upload DIRECTORY` uploads to local Garage and
`dev.py populate --source garage` imports from it. Local Garage remains in the
Kennel scaffold; it is not the default data source.

The local helper loads identity credentials from the server env file. The client
needs `/projects/maps/admins` in its Keycloak access token. It uses the minimal
`populate` dependency group, without the full scraper/geometry toolchain. The
`--local` mode always forces the local API destination, regardless of data source.
For a standalone import without `--local`, configure `S3_ENDPOINT`, `S3_ACCESS_KEY`,
`S3_SECRET_KEY`, optional `S3_BUCKET` and `S3_REGION`, `SERVER_URL`, `AUTH_CLIENT_ID`,
`AUTH_CLIENT_SECRET`, and `AUTH_ISSUER` for the intended environment explicitly.

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
