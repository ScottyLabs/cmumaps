#!/bin/bash
export VAULT_ADDR=https://secrets.scottylabs.org

APPLICATION="$1"
if [ "$APPLICATION" == "scripts" ]; then
  cat scripts/.env | xargs -r vault kv put -mount="ScottyLabs" "cmumaps/scripts"
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
  ENV_FILE_SUFFIX=""
  if [ "$ENV" != "local" ]; then
    ENV_FILE_SUFFIX=".$ENV"
  fi

  for APP in "${APPLICATIONS[@]}"; do
    cat apps/$APP/.env$ENV_FILE_SUFFIX | xargs -r vault kv put -mount="ScottyLabs" "cmumaps/$ENV/$APP"
  done
done
