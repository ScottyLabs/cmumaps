# Use Node.js LTS as the base image
FROM node:20-slim

# Set working directory for the monorepo
WORKDIR /app

# Copy the entire monorepo
COPY . /app

# Install all dependencies and build all packages
RUN npm install
RUN npm run build

# Generate Prisma client
WORKDIR /app/server
RUN npx prisma generate

# Expose the port your app runs on
EXPOSE 3000

# Start the server
CMD ["npm", "run", "-w", "@cmumaps/server", "start"] 