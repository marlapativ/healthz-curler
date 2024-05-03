#!/bin/bash

# Build the project
echo "Building the project..."
cd ../
docker build -t healthz-curler-bun -f bun/Dockerfile .
