## Getting Started


### Prerequisites

- Git
- Install bun (https://bun.com/get)
- Install vault (https://developer.hashicorp.com/vault/install)
- Install jq (https://jqlang.org/download/)
- Permissions
  - Be added to the CMUMaps Github team (https://github.com/orgs/ScottyLabs/teams/cmu-maps)
  - Get permission to view vault through (https://secrets.scottylabs.org/ui/vault/auth?with=oidc)

### Installation

1. Clone the repository
   1. Using GitHub Desktop: clone `cmumaps` from the GitHub by authenticating using your username. 
   2. Using CLI:
       1. In the folder on your computer that you want the cmumaps folder to be in, `git clone [git@github.com](mailto:git@github.com):ScottyLabs/cmumaps.git`

2. Run `bun install`

3. Set up environment variables
   1. Run `bun run vault:setup`
   2. Run `bun run vault:pull`

### Running the Application

You'll need to run both the frontend and backend servers in separate terminal windows.

#### Frontend

If you are only working on frontend, open cmumaps.code-workspace and run

```zsh
bun run dev
```

Otherwise, use

```zsh
bun run dev:web
```

#### Backend

##### Database
- Run the following command in `apps/server/docker`:
```zsh
docker compose up -d --build
```
- If you see errors about 'port in use', use `lsof -i :1234`, or whatever port is in use to find the port and free it.
Run the following in `apps/server`:
```zsh
bunx prisma db push
bun run dev
```
- To verify: go to `http://localhost/buildings` and it should show `{}` (and not internal server error).

##### Populating the Database


### Committing Tips
If you aren't allowed to commit, try the following:
1. `bun run check` and fix the errors. 
2. Make sure everything is formatted.
3. Make sure you are using a conventional commit message.