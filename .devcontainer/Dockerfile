FROM oven/bun:latest

# Install OpenSSL for Prisma and xdg-utils for Vault login
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        openssl \
        xdg-utils && \
    rm -rf /var/lib/apt/lists/*

# Copy everything
COPY . .
