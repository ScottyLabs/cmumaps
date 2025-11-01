# Scripts

This directory contains scripts that are used to manage the project.

## Usage

### `vault-pull.sh`

Pulls the secrets from the [Vault](https://secrets.scottylabs.org/ui/vault/secrets/ScottyLabs/kv/list/cmumaps/) and saves them to the corresponding `.env` file. Run the followwing command to see the usage:

```zsh
./scripts/vault-pull.sh -h
```

### `vault-push.sh`

Pushes the secrets to the [Vault](https://secrets.scottylabs.org/ui/vault/secrets/ScottyLabs/kv/list/cmumaps/) from the corresponding `.env` file. Run the followwing command to see the usage:

```zsh
./scripts/vault-push.sh -h
```

### `railway-push.sh`

Pushes the secrets to [Railway](https://railway.com/project/c90cb4e0-480e-4039-ba48-f06e4042d3ab/service/44518c94-f86d-4118-974f-c0067df844c9) from the corresponding `.env` file. Run the followwing command to see the usage:

```zsh
./scripts/railway-push.sh -h
```
