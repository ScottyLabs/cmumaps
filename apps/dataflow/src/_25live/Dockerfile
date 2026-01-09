# Base image with Python 3.12
FROM astral/uv:python3.12-bookworm-slim
WORKDIR /app

# Copy the dataflow directory
COPY apps/dataflow .

# Install deps
RUN uv sync --no-dev

# Set environment variable to print output to console
ENV PYTHONUNBUFFERED=1

# Run the script
CMD ["uv", "run", "--no-dev", "process-25live"]
