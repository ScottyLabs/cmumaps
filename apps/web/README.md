# CMU Maps Web

The [CMU Maps web app](https://cmumaps.com) provides a map of the CMU campus.

## Development

Use the [running guide](../../docs/src/Setup.md) to start the web and backend in
the development container. Open [localhost:5173](http://localhost:5173). Edit this
checkout on the host or attach VS Code to the container. `dev:host` binds port 5173
and fails if it is occupied, keeping browser login origins predictable.

The Compose configuration publishes services on loopback only. Viewing the app
from a separate phone requires an explicit network/auth-origin configuration;
the default local setup is not reachable over your LAN.

For an existing native-host environment with Bun and env files already configured,
`bun run dev:web` from the repository root runs both services. This is separate
from the container launcher and requires host runtimes.
