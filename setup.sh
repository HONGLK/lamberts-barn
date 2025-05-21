#!/bin/bash

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2 globally..."
  npm install -g pm2
fi

# Build frontend
echo "Building frontend..."
cd website
if command -v bun &> /dev/null; then
  bun install
  bun run build
else
  npm install
  npm run build
fi
cd ..

# Build backend
echo "Building backend..."
cd strapi-backend
if command -v bun &> /dev/null; then
  bun install
  bun run build
else
  npm install
  npm run build
fi
cd ..

# Start PostgreSQL and Nginx with Docker
echo "Starting PostgreSQL and Nginx with Docker..."
docker-compose up -d postgres nginx

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 10

# Start applications with PM2
echo "Starting applications with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
echo "Saving PM2 configuration..."
pm2 save

# Setup PM2 to start on system boot
echo "Setting up PM2 to start on system boot..."
pm2 startup

echo "Setup complete! Your applications are running."
echo "Frontend: http://localhost"
echo "Backend API: http://api.localhost"
echo "PM2 Dashboard: run 'pm2 monit' to monitor your applications"