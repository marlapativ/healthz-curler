#!/bin/bash

# Build the project
echo "Building the project..."
docker buildx build -t healthz-curler-bun --build-context sharedjs=../shared/js .
