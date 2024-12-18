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
    echo "$1" | sed -E 's:/+:/:g'
}

# Function to create remote directory
create_remote_dir() {
    local path="$1"
    IFS="/" read -ra parts <<< "$(clean_path "$path")"
    local current_path=""
    for part in "${parts[@]}"; do
        current_path="$current_path/$part"
        echo "mkdir -p \"$current_path\" || true"
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

# Function to remove files that are no longer present locally
remove_extra_files() {
    local remote_dir="$1"
    local local_dir="$2"
    echo "cd \"$remote_dir\""
    echo "ls -1" | while IFS= read -r remote_file; do
        local local_file="$local_dir/$remote_file"
        if [[ ! -e "$local_file" ]]; then
            echo "rm \"$remote_file\""
        fi
    done
}

# Upload HTML, SRC, and DIST files
upload_html() {
    upload_files "$HTML_DIR" "$BASE_REMOTE/html"
    remove_extra_files "$BASE_REMOTE/html" "$HTML_DIR"
}

upload_src() {
    upload_files "$SRC_DIR" "$BASE_REMOTE/src"
    remove_extra_files "$BASE_REMOTE/src" "$SRC_DIR"
}

upload_dist() {
    for file in "${DIST_FILES[@]}"; do
        local remote_file="$(clean_path "$BASE_REMOTE/$(basename "$file")")"
        echo "put \"$file\" \"$remote_file\""
    done
}

# Execute SFTP
sshpass -p "$PASSWORD" sftp -oBatchMode=no -oStrictHostKeyChecking=no "$USERNAME@$HOST" <<EOF
$(create_remote_dir "$BASE_REMOTE")
$(upload_html)
$(upload_src)
$(upload_dist)
bye
EOF
