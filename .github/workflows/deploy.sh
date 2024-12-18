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
    echo "$path" | sed -e 's://:/:g' -e 's:/$::'
}

# Function to create remote directories iteratively
create_remote_dirs() {
    local path="$1"
    local current_dir="/"
    IFS="/" read -ra parts <<< "$path"
    for part in "${parts[@]}"; do
        current_dir="$current_dir$part"
        echo "if [ ! -d \"$current_dir\" ]; then mkdir \"$current_dir\"; fi"
        current_dir="$current_dir/"
    done
}

# Function to upload files
upload_files() {
    local local_dir="$1"
    local remote_base="$2"
    find "$local_dir" -type f | while IFS= read -r file; do
        local relative_path="${file#$local_dir/}"
        local remote_path=$(clean_path "$remote_base/$relative_path")
        local remote_dir=$(dirname "$remote_path")
        echo "cd \"$remote_dir\""
        echo "put \"$file\" \"$(basename "$file")\""
    done
}

# Function to remove extra files from remote directory
remove_extra_files() {
    local remote_dir="$1"
    local local_dir="$2"
    echo "cd \"$remote_dir\""
    echo "ls -1" | while IFS= read -r remote_file; do
        if [[ ! -e "$local_dir/$remote_file" ]]; then
            echo "rm \"$remote_file\""
        fi
    done
}

# Execute SFTP
sshpass -p "$PASSWORD" sftp -oBatchMode=no -oStrictHostKeyChecking=no "$USERNAME@$HOST" <<EOF
$(create_remote_dirs "$BASE_REMOTE/html")
$(upload_files "$HTML_DIR" "$BASE_REMOTE/html")
$(remove_extra_files "$BASE_REMOTE/html" "$HTML_DIR")
$(create_remote_dirs "$BASE_REMOTE/src")
$(upload_files "$SRC_DIR" "$BASE_REMOTE/src")
$(remove_extra_files "$BASE_REMOTE/src" "$SRC_DIR")
$(upload_files "$(dirname "${DIST_FILES[0]}")" "$BASE_REMOTE")
bye
EOF
