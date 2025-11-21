# CMU Maps

## Overview

[CMU Maps](https://cmumaps.com) is a web application that provides a map of the CMU campus, allowing users to easily access information about campus locations. Key features include:

- View floorplans
- Room level navigation
- Search for buildings and rooms
- View building and room details

## Getting Started

### Permission Prerequisite

Follow the instructions in [governance/README.md](governance/README.md) to obtain the necessary permissions.

### Dev Container Setup

Prerequisites: [Docker](https://docs.docker.com/get-docker/) and [Dev Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

1. Clone and open the repository locally in VS Code (or any other IDE that supports Dev Containers).
2. Click on the `Reopen in Container` button that pops up in the bottom left corner of the VS Code window.
   - Or open the VS Code command palette (`Command+Shift+P`) and run the command `Dev Containers: Reopen in Container`.
3. Wait for the container to start. It may take a few minutes to install dependencies and run the post create script.
4. Follow the instructions in [apps/web/README.md](apps/web/README.md) or [apps/visualizer/README.md](apps/visualizer/README.md) to start developing on the web or visualizer!

### Troubleshooting

#### Post Create Script

If the post create command in dev container fails, you can manually run the post create script in the container by running the following command in the root directory:

```zsh
./scripts/post-create.sh
```

#### Manual Setup

If the dev container setup fails, try the manual setup instructions in the [wiki](https://github.com/ScottyLabs/cmumaps/wiki/Manual-Setup).
