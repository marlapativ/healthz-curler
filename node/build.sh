#!/bin/bash

# Build the project
echo "Building the project..."
cd ../
docker build -t node -f node/Dockerfile .
