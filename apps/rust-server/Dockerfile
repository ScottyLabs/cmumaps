# build stage
FROM rust:latest
WORKDIR /app

# Copy only the necessary files for the build
COPY apps/rust-server apps/rust-server

# Set the working directory to rust server application
WORKDIR /app/apps/rust-server

# Install dependencies
RUN cargo build --release

EXPOSE 3278

# set the start command to run the server
CMD ["cargo", "run", "--release", "--bin", "server"]