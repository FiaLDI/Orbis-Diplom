#!/usr/bin/env bash

set -e

./create_default_env.sh
./nginx/generate-cert.sh

docker compose up -d --build