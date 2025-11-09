# Getting Started

## Prerequisites

- Git
- Install bun (<https://bun.com/get>)
- Install vault (<https://developer.hashicorp.com/vault/install>)
- Install jq (<https://jqlang.org/download/>)
- Permissions: follow the instructions in [governance/README.md](governance/README.md) to get the necessary permissions.

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

## Troubleshooting

### Committing Tips

If you aren't allowed to commit, try the following:

1. `bun run check` and fix the errors.
2. Make sure you are using a [conventional commit message](https://www.conventionalcommits.org/en/v1.0.0/).
