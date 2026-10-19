# CMU Maps Server

## Overview

The CMU Maps server is a RESTful API that provides data for the CMU Maps applications.

## Local development

Use the [running guide](../../docs/src/Setup.md). The backend runs on port 80
inside the devcontainer and connects to the sibling PostgreSQL service at
`postgres:5432`. Run `bun run sync` from the repository root before checks/builds.
Local startup applies the Prisma schema, but does not populate map data.

Browser login uses Better Auth, Keycloak, and the configured Ricochet relay.
The population API accepts a signed, unexpired token from `AUTH_ISSUER` with
`/projects/maps/admins` in its groups; the current policy does not require audience.
See the running guide for OpenBao mappings and service-account setup.
