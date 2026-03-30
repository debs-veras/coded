#!/bin/sh

set -e

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Starting server..."

if [ $# -gt 0 ]; then
    exec "$@"
else
    exec python manage.py runserver 0.0.0.0:8000
fi
