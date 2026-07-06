#!/usr/bin/env bash

set -e

./nginx/generate-cert.sh

docker compose up -d --build