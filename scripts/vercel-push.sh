#!/bin/bash

usage() {
  echo
  echo -e "\tUsage: $0 APPLICATION ENVIRONMENT\n"
  echo -e "\t\tAPPLICATION: The application to push to, one of web | visualizer | all\n"
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

# Sanitizing the Application argument
if [ "$APPLICATION" == "all" ]; then
  APPLICATIONS=("web" "visualizer")
else
  case "$APPLICATION" in
  "web" | "visualizer")
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

# Pushing to vercel
for APPLICATION in "${APPLICATIONS[@]}"; do
  for ENVIRONMENT in "${ENVIRONMENTS[@]}"; do
    while IFS='=' read -r key value; do
      VERCEL_ENVIRONMENT=""
      if [ "$ENVIRONMENT" == "dev" ]; then
        VERCEL_ENVIRONMENT="preview"
      elif [ "$ENVIRONMENT" == "prod" ]; then
        VERCEL_ENVIRONMENT="production"
      fi

      vercel env rm $key --cwd apps/$APPLICATION $VERCEL_ENVIRONMENT --yes
      echo $value | vercel env --cwd apps/$APPLICATION add $key $VERCEL_ENVIRONMENT
    done <"apps/$APPLICATION/.env.$ENVIRONMENT"
  done
done
