# Governance

This directory contains scripts to handle permissions for the CMU Maps project.

## Overview

The `check` workflow will run the `sync` script on every push to the `main` branch to sync the team leads and members from `cmumaps.toml` to GitHub, Clerk, and Vault.

### Github

- Invite everyone in the team to the [ScottyLabs](https://github.com/ScottyLabs) Github organization.
  
- Add team members to the [CMU Maps](https://github.com/orgs/ScottyLabs/teams/cmu-maps) Github team as members.

- Add team leads to both the [CMU Maps](https://github.com/orgs/ScottyLabs/teams/cmu-maps) and [CMU Maps Admins](https://github.com/orgs/ScottyLabs/teams/cmu-maps-admins) Github teams as members.
  - No one should be a maintainer of the GitHub team since membership is managed by this governance folder.

- Delete any unknown member from the Github team.

- Add the repository to the Github team. Give CMU Maps team members write access and CMU Maps Admins admin access to the repository.

### Clerk

- In both Dev and Prod
  - Add team members to the CMU Maps Clerk organization with the appropriate role.

  - Delete unknown members from the CMU Maps Clerk organization.

### Keycloak

- You can make sure you have the right permissions by logging into the [vault](https://secrets.scottylabs.org/ui/vault/auth?with=oidc) and trying to access the secrets links below.

- Add team members to the Keycloak cmumaps-devs team.
  - Able to view any local secrets, such as [cmumaps/local/web](https://secrets.scottylabs.org/ui/vault/secrets/ScottyLabs/kv/cmumaps%2Flocal%2Fweb/details).

- Add team leads to the Keycloak cmumaps-admins team.
  - Able to view any dev secrets, such as [cmumaps/prod/web](https://secrets.scottylabs.org/ui/vault/secrets/ScottyLabs/kv/cmumaps%2Fprod%2Fweb/details).

## Running the script locally

```zsh
cd governance && python3 -m scripts.sync
```
