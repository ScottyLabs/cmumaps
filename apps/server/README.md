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

Push the database schema by running the following command in `apps/server`:

```zsh
bunx prisma db push
```

#### Troubleshooting

If you see errors about 'port in use', use `lsof -i :5432` to find the process using the port and kill it.

### Running the Server

Run the server by running the following command in `apps/server`:

```zsh
bun run dev
```

Navigate to <http://localhost/buildings> and make sure it shows `{}` instead of an internal server error.

### Populating the Database

Follow the instructions in [apps/data/README.md](../../apps/data/README.md) to populate the database.

### Development

You probably want to test your changes in the server by also running the web or the visualizer. Follow the instructions in [apps/web/README.md](../../apps/web/README.md) and [apps/visualizer/README.md](../../apps/visualizer/README.md) to run the web and the visualizer. You can also run them together with the server by running one of the following commands in the root directory:

```zsh
bun run dev:web
bun run dev:visualizer
bun run dev
```
