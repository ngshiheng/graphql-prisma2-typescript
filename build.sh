#!/usr/bin/env bash

DOCKER_IMAGE_NAME="${DOCKER_USERNAME}/graphql-prisma2-typescript"

echo "🐳 Building docker image for: $DOCKER_IMAGE_NAME"
docker build -t "$DOCKER_IMAGE_NAME" .
docker images
docker push "$DOCKER_IMAGE_NAME"
