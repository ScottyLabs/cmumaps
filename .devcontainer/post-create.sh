#!/usr/bin/env bash
set -e

# Install shfmt for shell script formatting
# https://formulae.brew.sh/formula/shfmt
brew install shfmt

# Install editorconfig-checker for linting with EditorConfig
# https://github.com/editorconfig-checker/editorconfig-checker?tab=readme-ov-file#6-using-homebrew
brew install editorconfig-checker

# Install UV for Python package management:
# https://docs.astral.sh/uv/getting-started/installation/#homebrew
brew install uv

# Install Bun for JavaScript package management:
# https://bun.com/get
curl -fsSL https://bun.sh/install | bash

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
