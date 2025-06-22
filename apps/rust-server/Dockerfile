# Build stage
FROM rust:bullseye as builder
WORKDIR /app

# Copy the source code
COPY . .

# set PAT from host env to container env
ARG GITHUB_ACCESS_TOKEN
ENV GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN}
RUN ./init_submodule.sh

WORKDIR /app/apps/rust-server

# build rust app and put it into /usr/local/.cargo/bin
RUN cargo install --path server

# builder image
FROM debian:bullseye-slim

# Copy the data directory
ENV DATA_PATH=/cmumaps-data
COPY --from=builder /app/cmumaps-data /cmumaps-data

# install runtime deps
RUN rm -rf /var/lib/apt/lists/*


COPY --from=builder /usr/local/cargo/bin/server /usr/local/bin/server

# Expose the port
EXPOSE 3278

# set the start command to run the server
CMD ["server"]

