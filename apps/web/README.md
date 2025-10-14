# CMU Maps Web

## Overview

The [CMU Maps web](https://cmumaps.com) is a web application that provides a map of the CMU campus.

## Setup

### Prequisite

- [Root README](../../README.md) setup

### Running the Web

#### Using the Staging Server

If you only wish to make frontend changes, change the `VITE_SERVER_URL` in [.env](.env) to <http://api.maps.slabs-staging.org> to use the staging server.

Then open cmumaps.code-workspace, open workspace, and run

```zsh
bun run dev
```

#### Using the Local Server

If you want to make both frontend and backend changes, you have to follow the steps in [server/README.md](../server/README.md) to run the server. You can also run both the server and the web by running

```zsh
bun run dev:web
```

#### Developing by viewing on a Mobile Device

Coming soon...
