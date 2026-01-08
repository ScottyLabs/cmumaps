# Base image with Python 3.12
FROM python:3.12-slim AS base
WORKDIR /app

# Copy data directory
COPY apps/dataflow .

# Install deps
RUN uv sync

# Set environment variable to print output to console
ENV PYTHONUNBUFFERED=1

# Run the script
CMD ["uv", "run", "25live/main.py"]
