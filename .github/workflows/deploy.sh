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
        echo "if ! ls \"$current_path\" > /dev/null 2>&1; then"
        echo "mkdir \"$current_path\" > /dev/null 2>&1 || :"
        echo "fi"
    done
}

# Funkce pro čištění cest
clean_path() {
    local path="$1"
    echo "$path" | sed 's:/\+:/:g'
}

# Funkce pro kontrolu existence souboru na serveru
file_exists() {
    local remote_file="$(clean_path "$1")"
    echo "ls \"$remote_file\" > /dev/null 2>&1"
}

# Funkce pro mazání souborů, které již neexistují lokálně
remove_extra_files() {
    local remote_dir="$1"
    local local_dir="$2"
    echo "cd \"$remote_dir\""
    echo "ls" | while IFS= read -r remote_file; do
        if [[ ! -e "$local_dir/$remote_file" ]]; then
            echo "rm \"$remote_file\""
        fi
    done
}

# Funkce pro nahrávání HTML složek
upload_html() {
    find "$HTML_DIR" -type f | while IFS= read -r file; do
        local relative_path="${file#$HTML_DIR/}"
        local remote_path="$(clean_path "$BASE_REMOTE/html/$relative_path")"
        local remote_dir=$(dirname "$remote_path")
        create_remote_dir "$remote_dir"
        echo "# Checking and uploading: $file to $remote_path"
        echo "if ! $(file_exists "$remote_path"); then"
        echo "cd \"$remote_dir\""
        echo "put \"$file\" \"$(basename "$file")\""
        echo "fi"
    done
    remove_extra_files "$BASE_REMOTE/html" "$HTML_DIR"
}

# Funkce pro nahrávání SRC složek
upload_src() {
    find "$SRC_DIR" -type f | while IFS= read -r file; do
        local relative_path="${file#$SRC_DIR/}"
        local remote_path="$(clean_path "$BASE_REMOTE/src/$relative_path")"
        local remote_dir=$(dirname "$remote_path")
        create_remote_dir "$remote_dir"
        echo "# Checking and uploading: $file to $remote_path"
        echo "if ! $(file_exists "$remote_path"); then"
        echo "cd \"$remote_dir\""
        echo "put \"$file\" \"$(basename "$file")\""
        echo "fi"
    done
    remove_extra_files "$BASE_REMOTE/src" "$SRC_DIR"
}

# Funkce pro nahrávání dist souborů
upload_dist() {
    for file in "${DIST_FILES[@]}"; do
        local remote_path="$(clean_path "$BASE_REMOTE/$(basename "$file")")"
        echo "# Checking and uploading: $file to $remote_path"
        echo "if ! $(file_exists "$remote_path"); then"
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
