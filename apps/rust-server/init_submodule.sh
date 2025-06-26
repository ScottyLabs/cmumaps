# github submodule repo address without https:// prefix
SUBMODULE_GITHUB=github.com/ScottyLabs/cmumaps-data.git
echo "Cloning submodule repository: https://$GITHUB_ACCESS_TOKEN@$SUBMODULE_GITHUB"
git clone https://$GITHUB_ACCESS_TOKEN@$SUBMODULE_GITHUB 
