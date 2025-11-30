#!/usr/bin/env bash
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
    if [[ -z "$APPLICATION" ]]; then
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

# Special case for scripts
if [[ "$APPLICATION" == "scripts" ]] || [[ "$APPLICATION" == "all" ]]; then
  vault kv get -format=json ScottyLabs/cmumaps/scripts |
    jq -r '.data.data | to_entries[] | "\(.key)=\"\(.value)\""' >scripts/.env
  echo "Pulled from vault: ScottyLabs/cmumaps/scripts"
  if [[ "$APPLICATION" == "scripts" ]]; then
    exit 0
  fi
fi

# Sanitizing the Application argument
if [ "$APPLICATION" == "all" ]; then
  APPLICATIONS=("web" "visualizer" "server" "rust-server" "data")
else
  case "$APPLICATION" in
  "web" | "visualizer" | "server" | "rust-server" | "data")
    APPLICATIONS=("$APPLICATION")
    ;;
  *)
    echo "Error: Invalid application: '$APPLICATION'" >&2
    usage
    exit 1
    ;;
  esac
fi

# Sanitizing the Environment argument
if [ "$ENVIRONMENT" == "all" ]; then
  ENVIRONMENT=("local" "dev" "staging" "prod")
else
  case "$ENVIRONMENT" in
  "local" | "dev" | "staging" | "prod")
    ENVIRONMENT=("$ENVIRONMENT")
    ;;
  *)
    echo "Error: Invalid environment: '$ENVIRONMENT'" >&2
    usage
    exit 1
    ;;
  esac
fi

# Pulling from vault
for ENV in "${ENVIRONMENT[@]}"; do
  for APP in "${APPLICATIONS[@]}"; do
    vault kv get -format=json ScottyLabs/cmumaps/$ENV/$APP |
      jq -r '.data.data | to_entries[] | "\(.key)=\"\(.value)\""' >apps/$APP/.env.$ENV
    echo "Pulled from vault: ScottyLabs/cmumaps/$ENV/$APP"
  done
done
