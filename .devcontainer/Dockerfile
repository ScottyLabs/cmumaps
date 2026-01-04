# Base image with Homebrew so we can install other dependencies in the container
# Unable to install packages due to curl: (35) error:0A0003E8:SSL routines::reason(1000)
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
