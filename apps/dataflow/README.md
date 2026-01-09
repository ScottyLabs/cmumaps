# CMU Maps Data

## Overview

This directory is responsible for handling data flow for CMU Maps. Check the
scripts section in `pyproject.toml` for the available commands. You can run a
script using the following command:

```zsh
uv run --env-file <ENV_FILE> <SCRIPT_NAME>
```

## _25live

`_25live/` directory contains the code for processing data from the 25live data
from the [event-scraper](https://github.com/ScottyLabs/event-scraper) s3 bucket
and populating the database with the data.

## scraper

`scraper/` is responsible for scraping floorplan data from the FMS website and
uploading it to the S3 bucket.

## processor

`processor/` is responsible for processing the scraped floorplan data, including
repositionig the svgs and merging the data into existing floorplan data.

## deserializer

`deserializer/` is responsible for deserializing the JSON files from the S3 bucket
and populating the database with the data.

## serializer

`serializer/` is responsible for serializing data from the database to JSON files.

## clients

`clients/` contains the clients for interacting with the CMU Maps API and S3 bucket.

## logger

`logger/` contains the logging functionality for the dataflow application.
