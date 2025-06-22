# Build stage
FROM rust:latest
WORKDIR /app

# Copy the source code
COPY . .

# Copy the data directory
ENV DATA_PATH=./cmumaps-data
RUN mv /app/apps/data/cmumaps-data /app/apps/rust-server/server/cmumaps-data

# Set the working directory to rust server application
WORKDIR /app/apps/rust-server/server

# Install dependencies
RUN cargo build --release

# Expose the port
EXPOSE 3278

# set the start command to run the server
CMD ["cargo", "run", "--release", "--bin", "server"]