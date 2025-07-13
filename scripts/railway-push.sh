#!/bin/bash
source ./scripts/.env

SERVICE="$1"
if [ "$SERVICE" == "all" ]; then
    SERVICES=("server" "rust-server")
else
    SERVICES=("$SERVICE")
fi

ENVIRONMENT="$2"
if [ "$ENVIRONMENT" == "all" ]; then
    ENVIRONMENTS=("dev" "prod")
else
    ENVIRONMENTS=("$ENVIRONMENT")
fi

for SERVICE in "${SERVICES[@]}"; do
    for ENVIRONMENT in "${ENVIRONMENTS[@]}"; do
        railway link -p $RAILWAY_PROJECT_ID -s $SERVICE -e $ENVIRONMENT
        while IFS='=' read -r key value; do
            RAILWAY_SET_ARGS+=" --set $key=${value//\"/}"
        done <"apps/$SERVICE/.env.$ENVIRONMENT"
        railway variables$RAILWAY_SET_ARGS
    done
done
