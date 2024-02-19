from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from rest_framework import serializers
from .models import User, Organization
from django.core.exceptions import ValidationError


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "password", "email", "telegram", "role")

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
