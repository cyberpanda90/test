#!/bin/bash

# Variables
HOST="$FTP_HOST"
USERNAME="$FTP_USER"
PASSWORD="$FTP_PASSWORD"

# Base remote directory
BASE_REMOTE="/mime"

# Local directories
HTML_DIR="app/html"
SRC_DIR="app/src"
DIST_FILES=("dist/script.js" "dist/style.css")

# Function to clean paths
clean_path() {
    local path="$1"
    echo "$path" | sed 's:/\+:/:g'
}

# Function to create remote directory structure iteratively
create_remote_dir() {
    local path="$1"
    local parts=()
    local current_path=""
    IFS="/" read -ra parts <<< "$(clean_path "$path")"
    for part in "${parts[@]}"; do
        current_path="$current_path/$part"
        echo "if ! ls \"$current_path\" > /dev/null 2>&1; then"
        echo "mkdir \"$current_path\" || true"
        echo "fi"
    done
}

# Function to upload files from a directory
upload_files() {
    local local_dir="$1"
    local remote_base="$2"
    find "$local_dir" -type f | while IFS= read -r file; do
        local relative_path="${file#$local_dir/}"
        local remote_path="$(clean_path "$remote_base/$relative_path")"
        local remote_dir=$(dirname "$remote_path")
        create_remote_dir "$remote_dir"
        echo "put \"$file\" \"$remote_path\""
    done
}

# Function to remove files that no longer exist locally
remove_extra_files() {
    local remote_dir="$1"
    local local_dir="$2"
    echo "ls \"$remote_dir\"" | while IFS= read -r remote_file; do
        local local_file="$local_dir/$remote_file"
        if [[ ! -e "$local_file" ]]; then
            echo "rm \"$remote_file\""
        fi
    done
}

# Execute SFTP
sshpass -p "$PASSWORD" sftp -oBatchMode=no -oStrictHostKeyChecking=no "$USERNAME@$HOST" <<EOF
$(create_remote_dir "$BASE_REMOTE/html")
$(upload_files "$HTML_DIR" "$BASE_REMOTE/html")
$(create_remote_dir "$BASE_REMOTE/src")
$(upload_files "$SRC_DIR" "$BASE_REMOTE/src")
$(upload_files "$(dirname "${DIST_FILES[0]}")" "$BASE_REMOTE")
bye
EOF
