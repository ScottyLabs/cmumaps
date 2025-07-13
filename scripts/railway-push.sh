#!/bin/bash
source ./scripts/.env

usage() {
  echo
  echo -e "\tUsage: $0 SERVICE ENVIRONMENT\n"
  echo -e "\t\tSERVICE: The service to push to, one of server | rust-server | all\n"
  echo -e "\t\tENVIRONMENT: The environment to push to, one of dev | prod | all\n"
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
      SERVICE="$1"
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

# Sanitizing the Service argument
if [ "$SERVICE" == "all" ]; then
  SERVICES=("server" "rust-server")
else
  case "$SERVICE" in
  "server" | "rust-server")
    SERVICES=("$SERVICE")
    ;;
  *)
    echo "Error: Invalid service: '$SERVICE'" >&2
    usage
    exit 1
    ;;
  esac
fi

# Sanitizing the Environment argument
if [ "$ENVIRONMENT" == "all" ]; then
  ENVIRONMENTS=("dev" "prod")
else
  case "$ENVIRONMENT" in
  "dev" | "prod")
    ENVIRONMENTS=("$ENVIRONMENT")
    ;;
  *)
    echo "Error: Invalid environment: '$ENVIRONMENT'" >&2
    usage
    exit 1
    ;;
  esac
fi

# Pushing to railway
for SERVICE in "${SERVICES[@]}"; do
  for ENVIRONMENT in "${ENVIRONMENTS[@]}"; do
    railway link -p $RAILWAY_PROJECT_ID -s $SERVICE -e $ENVIRONMENT
    while IFS='=' read -r key value; do
      RAILWAY_SET_ARGS+=" --set $key=${value//\"/}"
    done <"apps/$SERVICE/.env.$ENVIRONMENT"
    railway variables$RAILWAY_SET_ARGS
  done
done
