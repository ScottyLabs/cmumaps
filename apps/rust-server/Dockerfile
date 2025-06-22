# build stage
FROM rust:latest
WORKDIR /app
# Copy the source code
COPY apps/rust-server/ .

# configure cmumaps-data + tell rust where to find it
ENV DATA_PATH=./cmumaps-data
COPY apps/data/cmumaps-data ./cmumaps-data

# Install dependencies
RUN cargo build --release

EXPOSE 3278

# set the start command to run the server
CMD ["cargo", "run", "--release", "--bin", "server"]