#!/bin/bash
export VAULT_ADDR=https://secrets.scottylabs.org

usage() {
  echo
  echo -e "\tUsage: $0 APPLICATION ENVIRONMENT\n"
  echo -e "\t\tAPPLICATION: The application to pull from, one of web | visualizer | server | rust-server | data | scripts | all\n"
  echo -e "\t\tENVIRONMENT: The environment to pull from, one of local | dev | staging | prod | all\n"
  echo -e "\tOptions:"
  echo -e "\t\t-h, --help    Show this help message and exit\n"
}

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case "$1" in
  -h | --help)
    usage
    exit 0
    ;;
  *)
    if [[ -z "$SERVICE" ]]; then
      APPLICATION="$1"
    elif [[ -z "$ENVIRONMENT" ]]; then
      ENVIRONMENT="$1"
    else
      echo "Error: Too many arguments provided: '$1'" >&2
      usage
      exit 1
    fi
    ;;
  esac
  shift
done

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
