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
        echo "mkdir \"$current_path\" > /dev/null 2>&1 || :"
    done
}

# Funkce pro nahrávání HTML složek
upload_html() {
    find "$HTML_DIR" -type f | while IFS= read -r file; do
        local relative_path="${file#$HTML_DIR/}"
        local remote_path="$BASE_REMOTE/html/$relative_path"
        local remote_dir=$(dirname "$remote_path")
        create_remote_dir "$remote_dir"
        echo "cd \"$remote_dir\""
        echo "put \"$file\" \"$(basename "$file")\""
    done
}

# Funkce pro nahrávání SRC složek
upload_src() {
    find "$SRC_DIR" -type f | while IFS= read -r file; do
        local relative_path="${file#$SRC_DIR/}"
        local remote_path="$BASE_REMOTE/src/$relative_path"
        local remote_dir=$(dirname "$remote_path")
        create_remote_dir "$remote_dir"
        echo "cd \"$remote_dir\""
        echo "put \"$file\" \"$(basename "$file")\""
    done
}

# Funkce pro nahrávání dist souborů
upload_dist() {
    for file in "${DIST_FILES[@]}"; do
        local remote_path="$BASE_REMOTE/$(basename "$file")"
        echo "cd \"$BASE_REMOTE\""
        echo "put \"$file\" \"$(basename "$file")\""
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
