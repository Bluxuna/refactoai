#!/bin/bash
set -e

echo "🚀 Starting database initialization..."

# Create the database
echo "📦 Creating database..."
python scripts/create_db.py

# Seed the database
echo "🌱 Seeding database..."
python scripts/fill_db.py

echo "✅ Database initialization complete!"

# Start the application
echo "🚀 Starting server..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload
