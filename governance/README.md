# Governance

This directory contains scripts to handle permissions for the CMU Maps project.

## Usage

### `sync.py`

Syncs the team members from `cmumaps.toml` to

- Github
  - Add team members to the [ScottyLabs](https://github.com/ScottyLabs) Github organization.
  
  - Add team members to the [CMU Maps](https://github.com/orgs/ScottyLabs/teams/cmu-maps) Github team with the appropriate role.

  - Delete unknown members from the Github team.

- Clerk (both Dev and Prod)
  - Add team members to the CMU Maps Clerk organization with the appropriate role.
  - Delete unknown members from the CMU Maps Clerk organization.

```zsh
cd governance && python3 -m scripts.sync
```
