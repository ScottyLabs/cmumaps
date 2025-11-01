# Governance

This directory contains scripts to handle permissions for the CMU Maps project.

## Overview

Make a PR to add yourself to [cmumaps.toml](cmumaps.toml). The `check` workflow will run the `sync` script on every push to the `main` branch to sync the team leads and members from `cmumaps.toml` to GitHub, Clerk, and Vault.

### Github

- Invite everyone in the team to the [ScottyLabs](https://github.com/ScottyLabs) Github organization.

- Add the repository to the Github team. Give CMU Maps team members write access and CMU Maps Admins admin access to the repository.
  
- Add team members to the [CMU Maps](https://github.com/orgs/ScottyLabs/teams/cmu-maps) Github team as members.

- Add team leads to the [CMU Maps Admins](https://github.com/orgs/ScottyLabs/teams/cmu-maps-admins) Github team as members.
  - No one should be a maintainer of the GitHub team since membership is managed by this governance folder.

- Delete any unknown member from the Github team.

### Clerk

- In both Dev and Prod
  - Add team members to the CMU Maps Clerk organization with the appropriate role.

  - Delete unknown members from the CMU Maps Clerk organization.

### Keycloak

- Add team members to the Keycloak cmumaps-devs team.
  - Able to view any local secrets, such as [cmumaps/local/web](https://secrets.scottylabs.org/ui/vault/secrets/ScottyLabs/kv/cmumaps%2Flocal%2Fweb/details).

- Add team leads to the Keycloak cmumaps-admins team.
  - Able to view any dev secrets, such as [cmumaps/prod/web](https://secrets.scottylabs.org/ui/vault/secrets/ScottyLabs/kv/cmumaps%2Fprod%2Fweb/details).

## Validations

### Github

Check that you are added to the [CMU Maps](https://github.com/orgs/ScottyLabs/teams/cmu-maps) Github team.

### Clerk

Try to make an edit in <https://floorplans.slabs-staging.org> for dev and <https://floorplans.scottylabs.org> for prod and verify that you didn't get an unauthorized error toast.

### Keycloak

Make sure you have the right permissions by logging into the [vault](https://secrets.scottylabs.org/ui/vault/auth?with=oidc) and trying to access the secrets links in the Overview Keycloak section.

## Troubleshooting

- Check the [workflow output logs](https://github.com/ScottyLabs/cmumaps/actions/workflows/sync.yml) to see if your user is added to the Github team, Clerk organization, or Keycloak group.

- If your user is not found in Clerk, log in to <https://maps.slabs-staging.org> for dev and <https://maps.scottylabs.org> for prod to create your account and then rerun the workflow.

- If your user is not found in Keycloak, try logging into the [vault](https://secrets.scottylabs.org/ui/vault/auth?with=oidc) to create your account and then rerun the workflow.

- Make sure your andrew id in [cmumaps.toml](cmumaps.toml) is lowercased.

## Running the script locally

```zsh
cd governance && python3 -m scripts.sync
```
