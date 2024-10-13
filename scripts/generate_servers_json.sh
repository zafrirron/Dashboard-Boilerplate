# generate_servers_json.sh

# Load environment variables from the .env file
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Read environment variables (with fallback defaults)
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-"postgres"}
DB_PASSWORD=${DB_PASSWORD:-"password"}
DB_NAME=${DB_NAME:-"postgres"}

# Create the servers.json file dynamically
cat <<EOF > ./pgadmin-data/servers.json
{
  "Servers": {
    "1": {
      "Name": "PostgreSQL",
      "Group": "Servers",
      "Host": "${DB_HOST}",
      "Port": ${DB_PORT},
      "MaintenanceDB": "${DB_NAME}",
      "Username": "${DB_USER}",
      "Password": "${DB_PASSWORD}",
      "SSLMode": "prefer"
    }
  }
}
EOF
