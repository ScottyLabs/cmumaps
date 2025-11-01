#!/bin/bash
export VAULT_ADDR=https://secrets.scottylabs.org

usage() {
  echo
  echo -e "\tUsage: $0 APPLICATION ENVIRONMENT\n"
  echo -e "\t\tAPPLICATION: The application to push to, one of web | visualizer | server | rust-server | data | scripts | governance | all\n"
  echo -e "\t\tENVIRONMENT: The environment to push to, one of local | dev | staging | prod | all\n"
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
if [[ "$APPLICATION" == "scripts" || "$APPLICATION" == "all" ]]; then
  cat scripts/.env | xargs -r vault kv put -mount="ScottyLabs" "cmumaps/scripts"
  exit 0
fi

# Special case for governance
if [[ "$APPLICATION" == "governance" || "$APPLICATION" == "all" ]]; then
  cat governance/.env | xargs -r vault kv put -mount="ScottyLabs" "cmumaps/governance"
  exit 0
fi

# Sanitizing the Application argument
if [ "$APPLICATION" == "all" ]; then
  APPLICATIONS=("web" "visualizer" "server" "rust-server" "data")
else
  case "$APPLICATION" in
  "web" | "visualizer" | "server" | "rust-server" | "data")
    APPLICATIONS=($APPLICATION)
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

# Pushing to vault
for ENV in "${ENVIRONMENT[@]}"; do
  ENV_FILE_SUFFIX=""
  if [ "$ENV" != "local" ]; then
    ENV_FILE_SUFFIX=".$ENV"
  fi

  for APP in "${APPLICATIONS[@]}"; do
    cat apps/$APP/.env$ENV_FILE_SUFFIX | xargs -r vault kv put -mount="ScottyLabs" "cmumaps/$ENV/$APP"
  done
done
