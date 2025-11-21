# CMU Maps

## Overview

[CMU Maps](https://cmumaps.com) is a web application that provides a map of the CMU campus, allowing users to easily access information about campus locations. Key features include:

- View floorplans
- Room level navigation
- Search for buildings and rooms
- View building and room details

## Getting Started

### Permission Prerequisite

- Follow the instructions in [governance/README.md](governance/README.md)
to obtain the necessary permissions.

### Dev Container Setup

Prerequisite: [Docker](https://docs.docker.com/get-docker/)

1. Clone and open the repository locally in VS Code (or any other IDE that supports Dev Containers).
2. Install the Dev Container extension in VS Code.
3. Open the repository in VS Code.
4. Click on the `Reopen in Container` button in the bottom left corner of the VS Code window. Or run the command `Dev Containers: Reopen in Container` in the command palette (Command+Shift+P).
5. Wait for the container to start. This may take a few minutes to install the dependencies.
6. Follow the instructions in [apps/web/README.md](apps/web/README.md) or [apps/visualizer/README.md](apps/visualizer/README.md) to start developing on the web or visualizer!

### Manual Setup (Not Recommended)

The dev container setup is recommended and automated, but if you prefer to set up the environment manually or the dev container didn't work, follow the instructions below to manually set up the environment.

#### Install System-Level Dependencies

- Install bun (<https://bun.com/get>)
- Install vault (<https://developer.hashicorp.com/vault/install>)
- Install jq (<https://jqlang.org/download/>)
- Install ruff (<https://docs.astral.sh/ruff/installation/>)
- Install Python 3 (<https://www.python.org/downloads/>)

#### Install Bun Dependencies

1. Run `bun install`

2. Set up environment variables by running the following commands in the root directory:
   1. `bun run vault:setup`
   2. `bun run vault:pull all local`

#### Run the Applications

1. Follow the instructions in the [server README](apps/server/README.md) to start the server.

2. Keeps the server running and open another terminal. Follow the instructions in [apps/data/README.md](apps/data/README.md) to populate the database.

3. To populate the database, run the following command in `apps/data`:

   ```zsh
   python3 floorplans/deserializer/database_population.py
   ```

4. You can kill the server after the database is populated, so the port is available in the next step.

5. Follow the instructions in [apps/web/README.md](apps/web/README.md) or [apps/visualizer/README.md](apps/visualizer/README.md) to start developing on the web or visualizer!

## Troubleshooting

### Committing Tips

If you aren't allowed to commit, try the following:

1. Make sure you are using a [conventional commit message](https://www.conventionalcommits.org/en/v1.0.0/).
2. Run `bun run check` and try to fix the errors.
3. Try running `bun install` and `bun run check` again.

### Post Create Script

If the post create command in dev container fails, you can manually run the post create script in the container by running the following command in the root directory:

```zsh
./scripts/post-create.sh
```
