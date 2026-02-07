"""
Test settings that import production settings and enable TESTING flag.

This file is used only by pytest (configured in pytest.ini) so we avoid
placing test-only helpers at repository root.
"""
from .settings import *  # noqa: F403,F401

# Explicitly mark testing mode for other modules to check.
TESTING = True

# Optionally override other heavy services for tests here (databases, caches)
# e.g. use sqlite in-memory DB for faster tests if desired.
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': ':memory:',
#     }
# }
