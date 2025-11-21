#!/usr/bin/env zsh

# This script is run after the dev container is created.

# Activate Bun completions in zsh on startup
if ! grep -q 'source <(SHELL=zsh bun completions)' ~/.zshrc; then
    echo 'source <(SHELL=zsh bun completions)' >>~/.zshrc
fi

# Activate the virtual environment in zsh on startup
if ! grep -q "source .venv/bin/activate" ~/.zshrc; then
    echo "source .venv/bin/activate" >>~/.zshrc
fi

# # Install Bun dependencies
bun install

# # Set up environment variables
bun run vault:setup
bun run vault:pull all all

# Push the database schema
cd apps/server
bunx prisma db push

# Start the server in the background (without console output) for data population later
bun run dev >/dev/null 2>&1 &

# Create a virtual environment for Python
cd ../..
python3 -m venv .venv
source .venv/bin/activate
cd apps/data
pip install -r requirements.txt

# Populate the database
python3 floorplans/deserializer/database_population.py

# Kill the server
kill %1
