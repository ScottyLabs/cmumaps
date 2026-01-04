#!/usr/bin/env bash
set -e

# Download the editorconfig-checker binary manually
# Couldn't use the editorconfig-checker npm package because it fails to download
# the binary when running in the dev container.
install_editorconfig_checker() {
  # Fetch latest version tag from GitHub API
  local latest_version=$(curl -s https://api.github.com/repos/editorconfig-checker/editorconfig-checker/releases/latest | jq -r '.tag_name')

  # Get OS from uname by converting to lowercase
  local os=$(uname | tr '[:upper:]' '[:lower:]')

  # `uname -m` returns aarch64 instead of arm64 in dev container
  # so we use Bun to get the correct architecture
  local arch=$(bun --eval "import os from 'os'; console.log(os.arch())")

  # Create destination directory for the binary
  local dest_dir="ec"
  mkdir -p "$dest_dir"

  # Download the binary https://github.com/editorconfig-checker/editorconfig-checker?tab=readme-ov-file#quickstart
  # Move the binary to the destination directory and extract it
  local file_name="ec-$os-$arch.tar.gz"
  curl -O -L -C - https://github.com/editorconfig-checker/editorconfig-checker/releases/download/$latest_version/$file_name &&
    mv "$file_name" "$dest_dir/$file_name" &&
    tar xzf "$dest_dir/$file_name" -C "$dest_dir"

  # Create alias for editorconfig-checker
  echo "alias editorconfig-checker='$PWD/$dest_dir/bin/ec-$os-$arch'" >>~/.zshrc
}

install_editorconfig_checker

# Activate Bun completions in zsh on startup
if ! grep -q 'source <(SHELL=zsh bun completions)' ~/.zshrc; then
  echo 'source <(SHELL=zsh bun completions)' >>~/.zshrc
fi

# Install Bun dependencies
bun install

# Set up environment variables
bun run secrets:setup
bun run secrets:pull all all

# Push the database schema and generate OpenAPI spec
cd apps/server
bunx prisma db push
bun run tsoa
bun run openapi

# Start the server in the background (without console output) for data population
bun run dev >/dev/null 2>&1 &

# Create a virtual environment for Python
cd ../..
python3 -m venv .venv
source .venv/bin/activate
cd apps/data
pip install -r requirements.txt

# Activate the virtual environment in zsh on startup
if ! grep -q "source .venv/bin/activate" ~/.zshrc; then
  echo "source .venv/bin/activate" >>~/.zshrc
fi

# Populate the database
python3 floorplans/deserializer/database_population.py

# Kill the server
kill %1
