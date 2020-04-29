#!/usr/bin/env bash

DOCKER_IMAGE_NAME="${DOCKER_USERNAME}/graphql-prisma2-typescript"
TAG=$(date +%y.%m.%d)-$(git rev-parse --short HEAD)

echo "🐳 Building docker image for: $DOCKER_IMAGE_NAME:$TAG"
docker build -t "$DOCKER_IMAGE_NAME:$TAG" .
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"
docker images
docker push "$DOCKER_IMAGE_NAME:$TAG"
