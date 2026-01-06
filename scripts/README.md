# Scripts

This directory contains scripts that are used to manage the project's secrets.

## Usage

### `secrets-pull.sh`

Pulls the secrets from the [Vault](https://secrets.scottylabs.org/ui/vault/secrets/ScottyLabs/kv/list/cmumaps/) and saves them to the corresponding `.env` file. Run the followwing command to see the usage:

```zsh
./scripts/secrets-pull.sh -h
```

### `secrets-push.sh`

Pushes the secrets to the [Vault](https://secrets.scottylabs.org/ui/vault/secrets/ScottyLabs/kv/list/cmumaps/) from the corresponding `.env` file. Run the followwing command to see the usage:

```zsh
./scripts/secrets-push.sh -h
```

### `config.sh`

This script contains the configuration used by the other scripts.
