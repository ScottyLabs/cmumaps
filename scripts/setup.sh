#!/usr/bin/env bash
set -euo pipefail

#----------------------------------------------------------
# Helper function for logging
#----------------------------------------------------------
log() {
    # Escape with \[ and ] with \], and blue color for logging
    echo -e "\033[1;34m[INFO]\033[0m $*"
}

#----------------------------------------------------------
# Ensure Homebrew is installed
#----------------------------------------------------------
if ! command -v brew &>/dev/null; then
    log "Homebrew not found. Installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    log "Homebrew already installed"
fi

#----------------------------------------------------------
# Install Bun
#----------------------------------------------------------
if ! command -v bun &>/dev/null; then
    log "Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
else
    log "Bun already installed"
fi

#----------------------------------------------------------
# Install Vault
#----------------------------------------------------------
if ! command -v vault &>/dev/null; then
    log "Installing Vault..."
    brew tap hashicorp/tap
    brew install hashicorp/tap/vault
else
    log "Vault already installed"
fi

#----------------------------------------------------------
# Install jq
#----------------------------------------------------------
if ! command -v jq &>/dev/null; then
    log "Installing jq..."
    brew install jq
else
    log "jq already installed"
fi

#----------------------------------------------------------
# Install Ruff
#----------------------------------------------------------
if ! command -v ruff &>/dev/null; then
    log "Installing Ruff..."
    brew install ruff
else
    log "Ruff already installed"
fi

log "✅ All tools installed and ready!"
