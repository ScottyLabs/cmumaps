#!/bin/bash
export VAULT_ADDR=https://secrets.scottylabs.org

APPLICATION="$1"
if [ "$APPLICATION" == "scripts" ]; then
  vault kv get -format=json ScottyLabs/cmumaps/scripts |
    jq -r '.data.data | to_entries[] | "\(.key)=\"\(.value)\""' >scripts/.env
  exit 0
fi

if [ "$APPLICATION" == "all" ]; then
  APPLICATIONS=("web" "visualizer" "server" "rust-server" "data")
else
  APPLICATIONS=("$APPLICATION")
fi

ENVIRONMENT="$2"
if [ "$ENVIRONMENT" == "all" ]; then
  ENVIRONMENT=("local" "dev" "staging" "prod")
else
  ENVIRONMENT=("$ENVIRONMENT")
fi

for ENV in "${ENVIRONMENT[@]}"; do
  ENV_FILE_SUFFIX=".$ENV"
  if [ "$ENV" == "local" ]; then
    ENV_FILE_SUFFIX=""
  fi

  for APP in "${APPLICATIONS[@]}"; do
    vault kv get -format=json ScottyLabs/cmumaps/$ENV/$APP |
      jq -r '.data.data | to_entries[] | "\(.key)=\"\(.value)\""' >apps/$APP/.env$ENV_FILE_SUFFIX
  done
done
