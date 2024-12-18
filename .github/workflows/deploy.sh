#!/bin/bash

# Variables
HOST="$FTP_HOST"
USERNAME="$FTP_USER"
PASSWORD="$FTP_PASSWORD"

# Base remote directory
BASE_REMOTE="/mime"

# Lokální složky
HTML_DIR="app/html"
SRC_DIR="app/src"
DIST_FILES=("dist/script.js" "dist/style.css")

# Funkce pro vytvoření složky (rekurzivně)
create_remote_dir() {
    local path="$1"
    IFS="/" read -ra parts <<< "$path"
    local current_path=""
    for part in "${parts[@]}"; do
        current_path="$current_path/$part"
        echo "mkdir \"$current_path\" || true"
    done
}

# Funkce pro nahrávání souborů
upload_file() {
    local local_file="$1"
    local remote_file="$2"
    local remote_dir
    remote_dir=$(dirname "$remote_file")
    echo "mkdir \"$remote_dir\" || true"
    echo "put \"$local_file\" \"$remote_file\""
}

# Spuštění SFTP
sshpass -p "$PASSWORD" sftp -oBatchMode=no -oStrictHostKeyChecking=no "$USERNAME@$HOST" <<EOF
$(create_remote_dir "$BASE_REMOTE/html")
$(find "$HTML_DIR" -type f | while IFS= read -r file; do
    relative_path="${file#$HTML_DIR/}"
    remote_path="$BASE_REMOTE/html/$relative_path"
    upload_file "$file" "$remote_path"
done)

$(create_remote_dir "$BASE_REMOTE/src")
$(find "$SRC_DIR" -type f | while IFS= read -r file; do
    relative_path="${file#$SRC_DIR/}"
    remote_path="$BASE_REMOTE/src/$relative_path"
    upload_file "$file" "$remote_path"
done)

$(for file in "${DIST_FILES[@]}"; do
    remote_path="$BASE_REMOTE/$(basename "$file")"
    upload_file "$file" "$remote_path"
done)

bye
EOF
