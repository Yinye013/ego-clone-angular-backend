#!/bin/bash

echo "Starting build process..."

# Clean the dist folder if it exists
rm -rf dist
echo "Cleaned dist folder"

# Install dependencies
npm install
echo "Installed dependencies"

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
