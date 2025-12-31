export VAULT_ADDR=https://secrets.scottylabs.org
export PROJECT_NAME="cmumaps"

export APPLICATIONS_OPTIONS=("web" "server" "visualizer" "data")
APPLICATIONS_OPTIONS_JOINED=$(printf ' | %s' "${APPLICATIONS_OPTIONS[@]}")
export APPLICATIONS_OPTIONS_JOINED=${APPLICATIONS_OPTIONS_JOINED:3} # remove leading ' | '

export ENVIRONMENTS_OPTIONS=("applicants" "local" "dev" "staging" "prod")
ENVIRONMENTS_OPTIONS_JOINED=$(printf ' | %s' "${ENVIRONMENTS_OPTIONS[@]}")
export ENVIRONMENTS_OPTIONS_JOINED=${ENVIRONMENTS_OPTIONS_JOINED:3} # remove leading ' | '

export BLUE_TEXT="\033[34m"
export BOLD_TEXT="\033[1m"
export RESET_TEXT="\033[0m"
