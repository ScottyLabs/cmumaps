# CMU Maps Data

## Overview

This directory is responsible for handling data for CMU Maps.

## Setup

- [Root README](../../README.md) setup
- [Python 3](https://www.python.org/downloads/)

Run the following command in `apps/data` to install the requirements:

```zsh
pip install -r requirements.txt
```

## Features

### Floorplans

`floorplans/` directory contains the code for deserializing and serializing data from the database to JSON files.

#### Deserialization

Populate the database by running the following command in `apps/data`:

```zsh
python3 floorplans/deserializer/database_population.py
```

#### Serialization

Coming soon...

### Web Scraping

`webscraper/` directory contains the code for scraping data from the web.

#### Local Testing

To test the web scraper locally, run the following command in `apps/data`:

```zsh
python3 webscraper/main.py
```

#### Running with Docker

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
