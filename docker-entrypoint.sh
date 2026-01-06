#!/bin/sh
set -e

echo "Starting application..."

# Extract host and port from DATABASE_URL if it exists
if [ -n "$DATABASE_URL" ]; then
  echo "DATABASE_URL detected, parsing connection details..."

  # Parse DATABASE_URL more robustly
  # Format: postgresql://user:password@host:port/database
  DB_HOST=$(echo "$DATABASE_URL" | sed -E 's|.*@([^:/]+).*|\1|')
  DB_PORT=$(echo "$DATABASE_URL" | sed -E 's|.*:([0-9]+)/.*|\1|')

  echo "Parsed DB_HOST: ${DB_HOST}"
  echo "Parsed DB_PORT: ${DB_PORT}"

  # Validate that we got values
  if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ]; then
    echo "Warning: Could not parse DATABASE_URL properly, skipping health check"
    echo "Starting application anyway (Railway manages service dependencies)"
  else
    echo "Checking database connection to ${DB_HOST}:${DB_PORT}..."

    # Wait for postgres with timeout (max 30 seconds)
    RETRY_COUNT=0
    MAX_RETRIES=30
    until nc -z ${DB_HOST} ${DB_PORT} || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
      echo "PostgreSQL is unavailable - sleeping (attempt $RETRY_COUNT/$MAX_RETRIES)"
      sleep 1
      RETRY_COUNT=$((RETRY_COUNT + 1))
    done

    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
      echo "Warning: Could not connect to database after ${MAX_RETRIES} attempts"
      echo "Starting application anyway (will retry connection on startup)"
    else
      echo "PostgreSQL is up!"
    fi
  fi
else
  echo "No DATABASE_URL found, checking individual env vars..."
  DB_HOST=${DATABASE_HOST:-localhost}
  DB_PORT=${DATABASE_PORT:-5432}

  echo "Checking database connection to ${DB_HOST}:${DB_PORT}..."

  # Wait for postgres with timeout
  RETRY_COUNT=0
  MAX_RETRIES=30
  until nc -z ${DB_HOST} ${DB_PORT} || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
    echo "PostgreSQL is unavailable - sleeping (attempt $RETRY_COUNT/$MAX_RETRIES)"
    sleep 1
    RETRY_COUNT=$((RETRY_COUNT + 1))
  done

  if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "Warning: Could not connect to database after ${MAX_RETRIES} attempts"
  else
    echo "PostgreSQL is up!"
  fi
fi

echo "Starting NestJS application..."

# Start the application
exec node dist/main
