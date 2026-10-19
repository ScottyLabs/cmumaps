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

Local Garage provides an S3-compatible `maps` bucket on `http://localhost:9000`.
The importer reads dataset JSON under `floorplans/`; the backend writes those
records into PostgreSQL through its authorized population routes. Garage's data
persists in the `garage_data` volume. It is separate from hosted S3/CDN storage.

The local upload helper only uploads the four required JSON files and, when
requested, `osm-pois.json`. It does not publish to the public CDN or install missing
SVG assets. See the [Garage reference](../../scripts/dev/README.md) for credentials,
path-style S3 addressing, and persistence. Never commit downloaded campus datasets
or secrets; keep local input files under the ignored `uploads/` directory.
