export VAULT_ADDR=https://secrets.scottylabs.org 
APPLICATIONS=("web" "visualizer" "server" "rust-server" "data")
for APP in "${APPLICATIONS[@]}"; do
    vault kv get -format=json ScottyLabs/cmumaps/dev/$APP | \
    jq -r '.data.data | to_entries[] | "\(.key)=\"\(.value)\""' > apps/$APP/.env
done