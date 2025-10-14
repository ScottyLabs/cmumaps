# CMU Maps Server

## Overview

The CMU Maps server is a RESTful API that provides data for the CMU Maps applications.

## Setup

### Prequisite

- [Root README](../../README.md) setup
- [Docker](https://docs.docker.com/get-docker/)

### Database

Run the following command in `apps/server/docker` to start the database:

```zsh
docker compose up -d --build
```

Push the database schema to the database:

```zsh
bunx prisma db push
```

#### Troubleshooting

If you see errors about 'port in use', use `lsof -i :5432` to find the process using the port and kill it.

### Running the Server

Run the server:

```zsh
bun run dev
```

Navigate to <http://localhost/buildings> and make sure it shows `{}` instead of an internal server error.

### Populating the Database

Follow the instructions in [apps/data/README.md](../../apps/data/README.md) to populate the database.
