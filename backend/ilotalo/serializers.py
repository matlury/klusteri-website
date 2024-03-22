from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from rest_framework import serializers
from .models import User, Organization, Event, NightResponsibility


"""
Serializers convert complex data such as model instances (User, Organization etc.) to Python datatypes.
Those can then be easily rendered to JSON, XML or other contenty types. Serializers can also deserialize incoming data
back to complex data types.
More info: https://www.django-rest-framework.org/api-guide/serializers/
"""


class UserSerializer(serializers.ModelSerializer):
    organization = serializers.PrimaryKeyRelatedField(many=True, queryset=Organization.objects.all(), required=False)

    class Meta:
        model = User
        fields = ("id", "username", "password", "email", "telegram", "role", "organization")

    def validate_telegram(self, tgname):
        """Checks if a telegram name is taken"""
        user_id = self.instance.id if self.instance else None
        if tgname:
            duplicate = User.objects.exclude(id=user_id).filter(telegram=tgname)
            if duplicate.exists():
                raise serializers.ValidationError("This telegram name is taken")
        return tgname

    def validate(self, data):
        """Validates password when creating a new user"""
        password = data.get("password")

        try:
            validate_password(password)
        except exceptions.ValidationError as e:
            serializer_errors = serializers.as_serializer_error(e)
            raise exceptions.ValidationError(
                {"password": serializer_errors["non_field_errors"]}
            )
        return data

    def create(self, validated_data):
        """Serializes the User object as JSON"""
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            email=validated_data["email"],
            telegram=validated_data.get("telegram", ""),
            role=validated_data["role"],
        )

        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating a user
    """

    class Meta:
        model = User
        fields = ("id", "username", "email", "telegram", "role")

    def validate_telegram(self, tgname):
        """Checks if a telegram name is taken"""
        user_id = self.instance.id if self.instance else None
        if tgname:
            duplicate = User.objects.exclude(id=user_id).filter(telegram=tgname)
            if duplicate.exists():
                raise serializers.ValidationError("This telegram name is taken")
        return tgname

class UserNoPasswordSerializer(serializers.ModelSerializer):
    """
    Serializes a User object as JSON without displaying the hashed password
    """

    class Meta:
        model = User
        fields = ("id", "username", "email", "telegram", "role")


class OrganizationSerializer(serializers.ModelSerializer):
    """Serializes an Organization object as JSON"""

    class Meta:
        model = Organization
        fields = ("id", "name", "email", "homepage", "size")

class EventSerializer(serializers.ModelSerializer):
    """Serializes an Event object as JSON"""

    class Meta:
        model = Event
        fields = ("id", "start", "end", "room", "reservation", "description", "responsible", "open")

class NightResponsibilitySerializer(serializers.ModelSerializer):
    """Serializes a NightResponsibility object as JSON"""

    class Meta:
        model = NightResponsibility
        fields = ("id", "username", "email", "responsible_for", "login_time", "logout_time", "present", "late")
