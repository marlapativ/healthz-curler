#!/bin/bash

# Build the project
echo "Building the project..."
docker buildx build -t healthz-curler-node --build-context sharedjs=../shared/js .
