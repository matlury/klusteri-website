"""Gunicorn configuration file."""
import os

# Server socket
bind = "0.0.0.0:8000"

# Worker processes
workers = 2
worker_class = "uvicorn.workers.UvicornWorker"
timeout = 60

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Don't use preload - it breaks scheduler threads
# Instead, use a lock file in AppConfig to ensure only one worker starts scheduler
