# CMU Maps Server

## Overview

The CMU Maps server is a RESTful API that provides data for the CMU Maps applications.

## Getting Started

### Prequisite

- [Root README](../../README.md) setup

### Database

Push the database schema by running the following command in `apps/server`:

```zsh
bunx prisma db push
```

#### Troubleshooting

If you see errors about 'port in use', use `lsof -i :5432` to find the process using that port and kill it with `kill -9 <PID>`.

### Running the Server

Run the server by running the following command in `apps/server`:

```zsh
bun run dev
```

Navigate to <http://localhost/buildings> and make sure it shows `{}` instead of an internal server error.

## Development

Remember to run the following command to update the OpenAPI spec if the frontend needs to use the API.

```zsh
bun run openapi
```