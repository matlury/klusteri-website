"""
Test settings that import production settings and enable TESTING flag.

This file is used only by pytest (configured in pytest.ini) so we avoid
placing test-only helpers at repository root.
"""
import os

# Set a test reCAPTCHA secret key for test environment BEFORE importing settings
# Tests mock the API call anyway, so this just needs to be non-empty
os.environ.setdefault("RECAPTCHA_SECRET_KEY", "test-recaptcha-secret-key")

from .settings import *  # noqa: F403,F401

# Explicitly mark testing mode for other modules to check.
TESTING = True

# Disable throttling in tests to avoid rate limit issues during test execution
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "ilotalo.authentication.CookieJWTAuthentication",
    ),
    "DEFAULT_THROTTLE_CLASSES": (),  # Disable throttling for tests
    "DEFAULT_THROTTLE_RATES": {},
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 100,
}

# Optionally override other heavy services for tests here (databases, caches)
# e.g. use sqlite in-memory DB for faster tests if desired.
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': ':memory:',
#     }
# }
