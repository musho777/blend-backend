#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."

# Extract host and port from DATABASE_URL if it exists
if [ -n "$DATABASE_URL" ]; then
  # Parse DATABASE_URL (format: postgresql://user:password@host:port/database)
  DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
  DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
else
  DB_HOST=${DATABASE_HOST:-localhost}
  DB_PORT=${DATABASE_PORT:-5432}
fi

echo "Checking database connection to ${DB_HOST}:${DB_PORT}..."

# Wait for postgres to be ready
until nc -z ${DB_HOST} ${DB_PORT}; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - starting application"

# Start the application
exec node dist/main
