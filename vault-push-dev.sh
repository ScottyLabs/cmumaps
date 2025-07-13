export VAULT_ADDR=https://secrets.scottylabs.org 
APPLICATIONS=("web" "visualizer" "server" "rust-server" "data")
for APP in "${APPLICATIONS[@]}"; do
    cat apps/$APP/.env | xargs -r vault kv put -mount="ScottyLabs" "cmumaps/dev/$APP"
done
