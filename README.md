# CMU Maps

## Overview

[CMU Maps](https://cmumaps.com) is a web application that provides a map of the
Carnegie Mellon University campus, allowing users to easily access information about campus locations.

Key features include:

- View floorplans
- Room level navigation
- Search for buildings and rooms
- View building and room information

## Local development

Install Docker with Compose, Python, and OpenBao CLI on your host. Start Docker
Desktop, Colima, or Docker Engine, then log into OpenBao and launch the project:

```sh
export BAO_ADDR=https://secrets.scottylabs.org
bao login -method=oidc
python3 scripts/dev/dev.py start
```

On Windows PowerShell:

```powershell
$env:BAO_ADDR = "https://secrets.scottylabs.org"
bao login -method=oidc
py -3 scripts/dev/dev.py start
```

Open [localhost:5173](http://localhost:5173). The [running guide](docs/src/Setup.md)
covers prerequisites, importing shared CDN data into local PostgreSQL, daily
commands, and a manual walkthrough.
The launcher reports missing Docker/OpenBao dependencies; it does not install them.

## Documentation

The project documentation lives in [docs/src](docs/src/SUMMARY.md).
See the [script and Garage reference](scripts/dev/README.md) for the Kennel scaffold,
service layout, and storage configuration.

## Contributing

Please check out our [Contributing Guide](.github/CONTRIBUTING.md)
for more information about how to contribute to the project.
