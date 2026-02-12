from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    """Authenticate using Authorization header or HttpOnly cookie tokens.

    Returns AnonymousUser if no valid token is found, allowing public endpoints
    to work without authentication.
    """

    def get_header(self, request):
        header = super().get_header(request)
        if header:
            return header

        access_token = request.COOKIES.get("access_token")
        if access_token:
            return f"Bearer {access_token}".encode()

        return None

    def authenticate(self, request):
        """Authenticate the request, returning AnonymousUser if no token provided."""
        header = self.get_header(request)
        if header is None:
            # No token found - allow anonymous access
            return (AnonymousUser(), None)

        try:
            # Try to authenticate with the found token
            return super().authenticate(request)
        except Exception:
            # If token validation fails, still allow as anonymous
            return (AnonymousUser(), None)
