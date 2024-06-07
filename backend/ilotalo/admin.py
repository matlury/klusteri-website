from django.contrib import admin
from .models import User, Organization

"""
Manage the contents of the admin page at <baseurl>/admin
"""

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'password', 'email', 'telegram', 'role')

class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'homepage')

admin.site.register(User, UserAdmin)
admin.site.register(Organization, OrganizationAdmin)
