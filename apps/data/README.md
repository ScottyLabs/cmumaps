# CMU Maps Data

## Overview

This directory is responsible for handling data for CMU Maps.

## Getting Started

### Prequisite

- [Root README](../../README.md) setup

### Installing Requirements

1. Create and activate a virtual environment by running the following commands in the root directory:

```zsh
python3 -m venv venv
source venv/bin/activate
```

2. Run the following command in `apps/data` to install the requirements:

```zsh
pip3 install -r requirements.txt
```

## Floorplans

`floorplans/` directory contains the code for deserializing and serializing data from the database to JSON files.

### Deserialization

To populate the database using the data in the S3 bucket, run the following command in `apps/data`:

```zsh
python3 floorplans/deserializer/database_population.py
```

### Serialization

Coming soon...

## Web Scraping

`webscraper/` directory contains the code for scraping data from the web.

### Local Testing

To test the web scraper locally, run the following command in `apps/data`:

```zsh
python3 webscraper/main.py
```

### Running with Docker

To run the web scraper with Docker, run the following commands in the root directory to build the image and then run the container:

```zsh
docker build . -t cmumaps-webscraper -f ./apps/data/docker/Dockerfile
```

```zsh
docker run --rm -it \
  --name cmumaps-webscraper \
  --env-file apps/data/.env.prod \
  cmumaps-webscraper
```
