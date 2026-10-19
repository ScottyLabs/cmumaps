FROM nixos/nix:2.30.6 AS nix

# Use the same nixpkgs revision as devenv.lock for the bootstrap CLI.
RUN nix --extra-experimental-features 'nix-command flakes' profile install \
    --profile /nix/var/nix/profiles/devenv \
    github:NixOS/nixpkgs/7fd4004d0511991fff3a0524856a9be09e28c5f0#devenv

FROM ubuntu:24.04

# Host OS/tooling does not enter this image. App runtimes come from pinned Nix.
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash ca-certificates curl git iproute2 jq openssl procps unzip util-linux xz-utils \
    && rm -rf /var/lib/apt/lists/*

COPY --from=nix /nix /nix

# Nix runs as root inside the devcontainer; no host Nix daemon is needed.
RUN mkdir -p /etc/nix && \
    printf '%s\n' \
        'experimental-features = nix-command flakes' \
        'build-users-group =' \
        'sandbox = false' > /etc/nix/nix.conf

ENV PATH="/nix/var/nix/profiles/devenv/bin:/nix/var/nix/profiles/default/bin:${PATH}" \
    NIX_SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt

RUN git config --system --add safe.directory /workspace

WORKDIR /workspace
# Compose mounts the checkout at runtime, keeping secrets out of image layers.
