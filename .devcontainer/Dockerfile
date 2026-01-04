# Base image with Homebrew so we can install other dependencies in the container
# This approach gives us more visibility and control over the installation process.
FROM homebrew/brew:master

# Switch to root user to install packages
USER root

# Install OpenSSL for Prisma and xdg-utils for Vault login
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        openssl \
        xdg-utils && \
    rm -rf /var/lib/apt/lists/*

# Copy everything
COPY . .
