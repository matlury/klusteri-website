#!/bin/bash
set -e

echo "=== Starting Django Application ==="
echo "Running Django migrations..."
python manage.py makemigrations --no-input
python manage.py migrate --no-input

echo "Django setup complete!"
echo "Starting Gunicorn..."

# Reverted to working structure: Options first, then the application module.
# Removed extra blank lines between backslashes.
exec gunicorn --bind 0.0.0.0:8000 \
    --workers 2 \
    --worker-class gevent \
    --worker-connections 500 \
    --max-requests 1000 \
    --timeout 60 \
    --access-logfile - \
    --error-logfile - \
    backend.wsgi:application