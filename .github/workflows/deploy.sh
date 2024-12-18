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
    local dirs=""
    IFS="/" read -ra parts <<< "$path"
    for part in "${parts[@]}"; do
        dirs="$dirs/$part"
        echo "mkdir \"$dirs\" || :"
    done
}

# Funkce pro kontrolu existence souboru
file_exists() {
    local remote_file="$1"
    echo "if [ -f \"$remote_file\" ]; then"
    echo "  echo \"$remote_file exists\""
    echo "else"
}

# Funkce pro nahrávání HTML složek
upload_html() {
    find "$HTML_DIR" -type f | while IFS= read -r file; do
        local relative_path="${file#$HTML_DIR/}"
        local remote_path="$BASE_REMOTE/html/$relative_path"
        local remote_dir=$(dirname "$remote_path")
        create_remote_dir "$remote_dir"
        echo "# Checking and uploading: $file to $remote_path"
        file_exists "$remote_path"
        echo "cd \"$remote_dir\""
        echo "put \"$file\" \"$(basename "$file")\""
        echo "fi"
    done
}

# Funkce pro nahrávání SRC složek
upload_src() {
    find "$SRC_DIR" -type f | while IFS= read -r file; do
        local relative_path="${file#$SRC_DIR/}"
        local remote_path="$BASE_REMOTE/src/$relative_path"
        local remote_dir=$(dirname "$remote_path")
        create_remote_dir "$remote_dir"
        echo "# Checking and uploading: $file to $remote_path"
        file_exists "$remote_path"
        echo "cd \"$remote_dir\""
        echo "put \"$file\" \"$(basename "$file")\""
        echo "fi"
    done
}

# Funkce pro nahrávání dist souborů
upload_dist() {
    for file in "${DIST_FILES[@]}"; do
        local remote_path="$BASE_REMOTE/$(basename "$file")"
        echo "# Checking and uploading: $file to $remote_path"
        file_exists "$remote_path"
        echo "cd \"$BASE_REMOTE\""
        echo "put \"$file\" \"$(basename "$file")\""
        echo "fi"
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
