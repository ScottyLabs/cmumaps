# Data storage

## PostgreSQL

The backend uses Prisma with PostgreSQL. The authoritative schema lives in
[`apps/server/prisma`](../../apps/server/prisma). Map records include buildings,
floors, rooms, aliases, graph nodes/edges, and POIs; authentication tables are
managed alongside them. Population replaces the seven map tables, not user login
records.

Locally, Compose runs PostgreSQL 17 in a sibling container. The backend connects
to `postgres:5432`; the database port is not published to the host. Inspect it from
the repository root with:

```sh
docker compose -f .devcontainer/docker-compose.yml exec postgres psql -U postgres -d cmumaps
```

The `postgres_data` volume preserves data across container recreation. The startup
helper applies the Prisma schema but does not automatically populate it. See
[Running locally](Setup.md#upload-and-populate-the-local-database) for importing.
Hosted database access is configured separately; do not reuse local credentials.

## Object storage

The default development importer reads the allocated hosted CDN bucket
`cdn-maps` at `https://s3.scottylabs.org`, exposed at
`https://cdn.scottylabs.org/maps/`. OpenBao supplies its S3 settings and credentials
via the dataflow env file. Processed JSON under `floorplans/` is imported through
the local backend API into each developer's own PostgreSQL database. The importer
only reads hosted storage; publishing a dataset is a separate operation. Raw
`source-fetch/` artifacts do not replace the four processed JSON inputs.

Local Garage remains available for isolated experiments: S3 endpoint
`http://localhost:9000`, bucket `maps`, persisted in `garage_data`.
`populate --source garage` opts into it. The upload helper still targets only this
local bucket and never publishes to the CDN. See the [storage and script reference](../../scripts/dev/README.md)
for details. Keep downloaded campus datasets under ignored `uploads/` and never
commit credentials.

This setup uses the existing allocated bucket. Provisioning distinct hosted
buckets and credentials for development and production is an infrastructure
configuration task; the application does not create them automatically.
