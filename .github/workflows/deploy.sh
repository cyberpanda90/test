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
    local path="$(clean_path "$1")"
    IFS="/" read -ra parts <<< "$path"
    local current_path=""
    for part in "${parts[@]}"; do
        current_path="$current_path/$part"
        echo "mkdir \"$current_path\" || :"
    done
}

# Funkce pro čištění cest
clean_path() {
    local path="$1"
    echo "$path" | sed 's:/\+:/:g'
}

# Funkce pro kontrolu existence souboru a nahrávání
upload_file() {
    local local_file="$1"
    local remote_file="$2"
    local remote_dir="$(dirname "$remote_file")"
    echo "mkdir \"$remote_dir\" || :"
    echo "put \"$local_file\" \"$remote_file\""
}

# Funkce pro nahrávání HTML složek
upload_html() {
    find "$HTML_DIR" -type f | while IFS= read -r file; do
        local relative_path="${file#$HTML_DIR/}"
        local remote_path="$(clean_path "$BASE_REMOTE/html/$relative_path")"
        upload_file "$file" "$remote_path"
    done
}

# Funkce pro nahrávání SRC složek
upload_src() {
    find "$SRC_DIR" -type f | while IFS= read -r file; do
        local relative_path="${file#$SRC_DIR/}"
        local remote_path="$(clean_path "$BASE_REMOTE/src/$relative_path")"
        upload_file "$file" "$remote_path"
    done
}

# Funkce pro nahrávání dist souborů
upload_dist() {
    for file in "${DIST_FILES[@]}"; do
        local remote_path="$(clean_path "$BASE_REMOTE/$(basename "$file")")"
        upload_file "$file" "$remote_path"
    done
}

# Spuštění SFTP
sshpass -p "$PASSWORD" sftp -oBatchMode=no -oStrictHostKeyChecking=no "$USERNAME@$HOST" <<EOF
$(create_remote_dir "$BASE_REMOTE/html")
$(upload_html)
$(create_remote_dir "$BASE_REMOTE/src")
$(upload_src)
$(upload_dist)
bye
EOF
