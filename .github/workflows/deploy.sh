#!/bin/bash

# Variables
HOST="$FTP_HOST"
USERNAME="$FTP_USER"
PASSWORD="$FTP_PASSWORD"

# Base remote directory
BASE_REMOTE="/mime"

# Lokální složky
declare -a HTML_DIRS=("app/html")
declare -a SRC_DIRS=("app/src")
declare -a DIST_FILES=("dist/script.js" "dist/style.css")

# Kontrola a vytvoření adresáře na vzdáleném serveru
check_and_create_directory() {
    local remote_path="$1"
    echo "ls \"$remote_path\" > /dev/null 2>&1 || mkdir \"$remote_path\""
}

# Funkce pro nahrání HTML složek
upload_html() {
    local dir="$1"
    local remote_dir="$BASE_REMOTE/html"

    # Procházení všech souborů a složek
    find "$dir" -type f | while IFS= read -r file; do
        local relative_path="${file#$dir/}" # Relativní cesta vůči root složce
        local remote_path="$remote_dir/$relative_path"

        # Vytvoření adresářů na serveru
        local remote_subdir=$(dirname "$remote_path")
        check_and_create_directory "$remote_subdir"

        # Nahrání souboru
        echo "put \"$file\" \"$remote_path\""
    done
}

# Funkce pro nahrání SRC složek
upload_src() {
    local dir="$1"
    local remote_dir="$BASE_REMOTE/src"

    # Procházení všech souborů a složek
    find "$dir" -type f | while IFS= read -r file; do
        local relative_path="${file#$dir/}" # Relativní cesta vůči root složce
        local remote_path="$remote_dir/$relative_path"

        # Vytvoření adresářů na serveru
        local remote_subdir=$(dirname "$remote_path")
        check_and_create_directory "$remote_subdir"

        # Nahrání souboru
        echo "put \"$file\" \"$remote_path\""
    done
}

# Funkce pro nahrání jednotlivých dist souborů
upload_dist() {
    local file="$1"
    local remote_path="$BASE_REMOTE/$(basename "$file")"

    # Nahrání souboru
    echo "put \"$file\" \"$remote_path\""
}

# Start SFTP session
sshpass -p "$PASSWORD" sftp -oBatchMode=no -oStrictHostKeyChecking=no "$USERNAME@$HOST" <<EOF
# Nahrání HTML složek
$(for dir in "${HTML_DIRS[@]}"; do upload_html "$dir"; done)

# Nahrání SRC složek
$(for dir in "${SRC_DIRS[@]}"; do upload_src "$dir"; done)

# Nahrání dist souborů
$(for file in "${DIST_FILES[@]}"; do upload_dist "$file"; done)

bye
EOF
