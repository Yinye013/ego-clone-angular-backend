#!/bin/bash

echo "Starting build process..."

# Clean the dist folder if it exists
rm -rf dist
echo "Cleaned dist folder"

# Install dependencies (without dev dependencies for production)
npm ci --only=production
echo "Installed production dependencies"

# Install TypeScript and ts-node for building
npm install --no-save typescript ts-node tsconfig-paths
echo "Installed build dependencies"

# Run TypeScript compilation directly
npx tsc
echo "Compiled TypeScript"

# Copy data-source.ts to dist directory
cp data-source.ts dist/
echo "Copied data-source.ts to dist/"

# Run migrations
npm run migration:run
echo "Ran database migrations"

echo "Build process completed"
