# Build stage
FROM rust:bullseye as builder
WORKDIR /app

# Copy the source code
COPY . .

# set PAT from host env to container env
ARG GITHUB_ACCESS_TOKEN
ENV GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN}
RUN /app/apps/rust-server/init_submodule.sh

WORKDIR /app/apps/rust-server

# build rust app and put it into /usr/local/.cargo/bin
RUN cargo install --path server

# runner image (small debian image)
FROM debian:bullseye-slim

# Copy the data directory
ENV DATA_PATH=/cmumaps-data
COPY --from=builder /app/cmumaps-data /cmumaps-data

# remove bloat
RUN rm -rf /var/lib/apt/lists/*

# copy the server binary from the builder image
COPY --from=builder /usr/local/cargo/bin/server /usr/local/bin/server

# Expose the port
EXPOSE 3278

# set the node environment to production
ENV NODE_ENV production

# set the start command to run the server
CMD ["server"]

