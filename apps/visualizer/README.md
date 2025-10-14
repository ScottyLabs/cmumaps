# CMU Maps Web

## Overview

The [CMU Maps visualizer](https://floorplans.scottylabs.org) is a tool to help visualize the CMU Maps data.

## Setup

### Prequisite

- [Root README](../../README.md) setup

### Running the Visualizer

#### Using the Staging Server

If you only wish to make frontend changes, change the `VITE_SERVER_URL` in [.env](.env) to <http://api.maps.slabs-staging.org> to use the staging server.

Then run the following command in `apps/visualizer`:

```zsh
bun run dev
```

#### Using the Local Server

If you want to make both frontend and backend changes, you have to follow the steps in [server/README.md](../server/README.md) to run the server. You can also run both the server and the web by running

```zsh
bun run dev:visualizer
```
