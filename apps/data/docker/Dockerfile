# Base image with Python 3.12
FROM python:3.12-slim AS base
WORKDIR /app

# Copy data directory
COPY apps/data .

# Install deps
RUN pip install -r requirements.txt

# Run the script
CMD ["python", "webscraper/main.py"]