#!/usr/bin/env bash
source ./scripts/config.sh

usage() {
  echo
  echo -e "\tUsage: $0 APPLICATION ENVIRONMENT\n"
  echo -e "\t\tAPPLICATION: The application to pull from, one of $APPLICATIONS_OPTIONS_JOINED | all\n"
  echo -e "\t\tENVIRONMENT: The environment to pull from, one of $ENVIRONMENTS_OPTIONS_JOINED | all\n"
  echo -e "\tOptions:"
  echo -e "\t\t-h, --help   Show this help message and exit\n"
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

# Sanitize the Application argument
if [ "$APPLICATION" == "all" ]; then
  APPLICATIONS=("${APPLICATIONS_OPTIONS[@]}")
else
  # Make sure there is at least one valid application
  valid=false
  for opt in "${APPLICATIONS_OPTIONS[@]}"; do
    if [ "$APPLICATION" == "$opt" ]; then
      APPLICATIONS=("$APPLICATION")
      valid=true
      break
    fi
  done

  if [ "$valid" == false ]; then
    echo "Error: Invalid application: '$APPLICATION'" >&2
    usage
    exit 1
  fi
fi

# Sanitize the Environment argument
if [ "$ENVIRONMENT" == "all" ]; then
  ENVIRONMENT=("${ENVIRONMENTS_OPTIONS[@]}")
else
  # Make sure there is at least one valid environment
  valid=false
  for opt in "${ENVIRONMENTS_OPTIONS[@]}"; do
    if [ "$ENVIRONMENT" == "$opt" ]; then
      ENVIRONMENT=("$ENVIRONMENT")
      valid=true
      break
    fi
  done

  if [ "$valid" == false ]; then
    echo "Error: Invalid environment: '$ENVIRONMENT'" >&2
    usage
    exit 1
  fi
fi

# Pull from vault
for APP in "${APPLICATIONS[@]}"; do
  echo -e "${BOLD_TEXT}==================================================${RESET_TEXT}"
  echo -e "${BOLD_TEXT}Pulling secrets for $APP${RESET_TEXT}"
  echo -e "${BOLD_TEXT}==================================================${RESET_TEXT}"
  for ENV in "${ENVIRONMENT[@]}"; do
    echo
    echo -e "${BLUE_TEXT}Pulling from vault: ScottyLabs/$PROJECT_NAME/$ENV/$APP${RESET_TEXT}"
    vault kv get -format=json ScottyLabs/$PROJECT_NAME/$ENV/$APP |
      jq -r '.data.data | to_entries[] | "\(.key)=\"\(.value)\""' >apps/$APP/.env.$ENV
  done
  echo
done
