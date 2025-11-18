FROM oven/bun:latest

# Install OpenSSL for Prisma and xdg-utils for Vault login
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        openssl \
        xdg-utils && \
    rm -rf /var/lib/apt/lists/*

# Add Bun autocompletion to Oh My Zsh
RUN mkdir -p "$HOME/.oh-my-zsh/completions"; \
    SHELL=zsh bun completions zsh > "$HOME/.oh-my-zsh/completions/_bun"; \
    # .zshrc will get overwritten when zsh is installed but ~/.oh-my-zsh/completions is preserved
    echo 'fpath+=($HOME/.oh-my-zsh/completions)' >> "$HOME/.zshrc"; \
    echo 'autoload -Uz compinit' >> "$HOME/.zshrc"; \
    echo 'compinit' >> "$HOME/.zshrc";

# Copy everything
COPY . .
