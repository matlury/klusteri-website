"""
Custom permission classes for role-based access control (RBAC)
Centralizes authorization logic to prevent IDOR and authorization flaws
"""
from rest_framework import permissions
from .config import Role


class IsLeppisPJ(permissions.BasePermission):
    """
    Permission class that allows only LeppisPJ (role 1) users
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == Role.LEPPISPJ.value


class IsLeppisPJOrVaraPJ(permissions.BasePermission):
    """
    Permission class that allows LeppisPJ (role 1) or LeppisVaraPJ (role 2) users
    """

    def has_permission(self, request, view):
        return (request.user.is_authenticated and
                request.user.role in [Role.LEPPISPJ.value, Role.LEPPISVARAPJ.value])


class IsManagementRole(permissions.BasePermission):
    """
    Permission class that allows management roles:
    - LeppisPJ (role 1)
    - LeppisVaraPJ (role 2)
    - Muokkaus (role 3)
    """

    def has_permission(self, request, view):
        return (request.user.is_authenticated and
                request.user.role in [Role.LEPPISPJ.value, Role.LEPPISVARAPJ.value, Role.MUOKKAUS.value])


class IsOrganizationLeader(permissions.BasePermission):
    """
    Permission class that allows organization leaders:
    - JarjestoPJ (role 6)
    - JarjestoVaraPJ (role 7)
    Plus all management roles
    """

    def has_permission(self, request, view):
        return (request.user.is_authenticated and
                request.user.role in [
                    Role.LEPPISPJ.value,
                    Role.LEPPISVARAPJ.value,
                    Role.MUOKKAUS.value,
                    Role.JARJESTOPJ.value,
                    Role.JARJESTOVARAPJ.value
                ])


class HasKeyAccess(permissions.BasePermission):
    """
    Permission class that allows users with key access (Avaimellinen or higher)
    - Avaimellinen (role 4)
    - Plus all management and organization leader roles
    """

    def has_permission(self, request, view):
        return (request.user.is_authenticated and
                request.user.role in [
                    Role.LEPPISPJ.value,
                    Role.LEPPISVARAPJ.value,
                    Role.MUOKKAUS.value,
                    Role.AVAIMELLINEN.value,
                    Role.JARJESTOPJ.value,
                    Role.JARJESTOVARAPJ.value
                ])


class CanModifyUserData(permissions.BasePermission):
    """
    Permission class for user data modification
    - Users can modify their own data
    - LEPPISPJ and LEPPISVARAPJ can modify any user data
    - MUOKKAUS can only modify AVAIMELLINEN and TAVALLINEN users (not admins)
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Users can modify their own data
        if obj.id == request.user.id:
            return True

        # LEPPISPJ and LEPPISVARAPJ can modify any user data
        if request.user.role in [Role.LEPPISPJ.value, Role.LEPPISVARAPJ.value]:
            return True

        # MUOKKAUS can only modify AVAIMELLINEN and TAVALLINEN users
        if request.user.role == Role.MUOKKAUS.value:
            return obj.role in [Role.AVAIMELLINEN.value, Role.TAVALLINEN.value]

        return False


class CanCreateReservation(permissions.BasePermission):
    """
    Permission class for creating event reservations
    Users must have reservation rights or be in a management role
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Management roles always have permission
        if request.user.role in [Role.LEPPISPJ.value, Role.LEPPISVARAPJ.value, Role.MUOKKAUS.value]:
            return True

        # Check if user has reservation rights
        return request.user.rights_for_reservation


class CanModifyReservation(permissions.BasePermission):
    """
    Permission class for modifying/deleting event reservations
    - Management roles can modify any reservation
    - Event creators can modify their own reservations
    - Organization leaders can modify reservations with reservation rights
    - Key holders (AVAIMELLINEN) with reservation rights can modify
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Management roles can modify any reservation
        if request.user.role in [Role.LEPPISPJ.value, Role.LEPPISVARAPJ.value, Role.MUOKKAUS.value]:
            return True

        # Event creators can modify their own reservations
        if hasattr(obj, 'created_by') and obj.created_by and obj.created_by.id == request.user.id:
            return True

        # Organization leaders with reservation rights
        if request.user.role in [Role.JARJESTOPJ.value, Role.JARJESTOVARAPJ.value]:
            return True

        # Key holders with reservation rights
        if request.user.role == Role.AVAIMELLINEN.value and request.user.rights_for_reservation:
            return True

        return False


class ReadOnly(permissions.BasePermission):
    """
    Permission class that allows read-only access for authenticated users
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.method in permissions.SAFE_METHODS


class ReadOnlyOrAnonymous(permissions.BasePermission):
    """
    Permission class that allows read-only access for both authenticated and anonymous users.
    Used for public data like event listings.
    """

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS
