#!/usr/bin/env bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CERT_DIR="$SCRIPT_DIR/ssl"

mkdir -p "$CERT_DIR"

if [ -f "$CERT_DIR/selfsigned.pem" ] && [ -f "$CERT_DIR/selfsigned_key.pem" ]; then
    echo "SSL certificates already exist."
    exit 0
fi

echo "Generating self-signed certificate..."

openssl req \
    -x509 \
    -nodes \
    -days 3650 \
    -newkey rsa:4096 \
    -keyout "$CERT_DIR/selfsigned_key.pem" \
    -out "$CERT_DIR/selfsigned.pem" \
    -subj "/C=RU/ST=Local/L=Local/O=Orbis/OU=Development/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

echo "Done."
