# Getting Started

## Prerequisites

- Git
- Install bun (<https://bun.com/get>)
- Install vault (<https://developer.hashicorp.com/vault/install>)
- Install jq (<https://jqlang.org/download/>)
- Permissions
  - Make a PR to add yourself as a member to [cmumaps.toml](governance/cmumaps.toml).
  - Make sure you can log into [vault](https://secrets.scottylabs.org/ui/vault/auth?with=oidc) and view the [dev secrets](https://secrets.scottylabs.org/ui/vault/secrets/ScottyLabs/kv/list/cmumaps/dev/).

## Installation

1. Clone the repository

2. Run `bun install`

3. Set up environment variables
   1. Run `bun run vault:setup`
   2. Run `bun run vault:pull`

## Running the Application

Follow the instructions in the respective README files:

- Web: [apps/web/README.md](apps/web/README.md)
- Server: [apps/server/README.md](apps/server/README.md)
- Data: [apps/data/README.md](apps/data/README.md)
- Visualizer: [apps/visualizer/README.md](apps/visualizer/README.md)

### Committing Tips

If you aren't allowed to commit, try the following:

1. `bun run check` and fix the errors.
2. Make sure you are using a [conventional commit message](https://www.conventionalcommits.org/en/v1.0.0/).
