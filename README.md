# Getting Started

## Prerequisites

- Git
- Install bun (<https://bun.com/get>)
- Install vault (<https://developer.hashicorp.com/vault/install>)
- Install jq (<https://jqlang.org/download/>)
- Permissions
  - Be added to the CMUMaps Github team (<https://github.com/orgs/ScottyLabs/teams/cmu-maps>)
  - Get permission to view vault through (<https://secrets.scottylabs.org/ui/vault/auth?with=oidc>)

## Installation

1. Clone the repository

2. Run `bun install`

3. Set up environment variables
   1. Run `bun run vault:setup`
   2. Run `bun run vault:pull`

## Running the Application

### Frontend

If you are only working on frontend, open cmumaps.code-workspace, open workspace, and run

```zsh
bun run dev
```

Otherwise, use

```zsh
bun run dev:web
```

#### Backend



### Committing Tips

If you aren't allowed to commit, try the following:

1. `bun run check` and fix the errors.
2. Make sure you are using a [conventional commit message](https://www.conventionalcommits.org/en/v1.0.0/).
