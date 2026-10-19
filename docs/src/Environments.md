# Environments

## Local development

The supported local workflow is documented in [Running locally](Setup.md).
Docker runs a Linux development container and a sibling PostgreSQL 17 container.
Nix/devenv uses Kennel's module for Garage and Ricochet. It does not deploy the app.

| Component | Local address | Configuration |
| --- | --- | --- |
| Web | `http://localhost:5173` | Vite in the devcontainer |
| API | `http://localhost` | Bun in the devcontainer |
| OAuth relay | `http://localhost:8090` | Kennel Ricochet; registered callback from OpenBao |
| Shared dataset | `https://s3.scottylabs.org` | Allocated CDN bucket `cdn-maps`, read using OpenBao credentials |
| Optional local S3 API | `http://localhost:9000` | Garage, bucket `maps`; select `--source garage` |
| PostgreSQL | `postgres:5432` inside Docker | No host port published |
| Identity provider | ScottyLabs Keycloak | Development client from OpenBao |

The local setup uses `secret/secretspec/maps/dev` for identity, MapKit, and CDN values.
Database and Garage credentials are public local defaults, and their volumes are
independent of hosted storage. Population reads shared hosted JSON and copies
its records into local PostgreSQL; it does not synchronize databases automatically. The launcher does not write secrets back to OpenBao.

## Hosted environments

The public app is [CMU Maps](https://cmumaps.com). Hosted web/API/identity/storage
settings are deployment-specific and must not be replaced with local defaults.
Older native setup commands retain environment profiles such as staging and prod;
they are separate from this local container workflow.

The root Nix scaffold preserves Kennel integration for a future migration. It
currently enables local services, not production application deployment. Consult
the team's deployment configuration for current hosted endpoints and credentials;
this local setup does not provision them.
