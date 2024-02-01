from django.contrib import admin
from .models import User, Organization

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'password', 'email', 'telegram', 'role')

class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'homepage', 'size')

admin.site.register(User, UserAdmin)
admin.site.register(Organization, OrganizationAdmin)
