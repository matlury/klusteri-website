from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from rest_framework import serializers
from .models import User, Organization

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'telegram', 'role')

    def validate(self, data):
        #user = User(**data)
        password = data.get('password')

        try:
            validate_password(password)
        except exceptions.ValidationError as e:
            serializer_errors = serializers.as_serializer_error(e)
            raise exceptions.ValidationError(
                {'password': serializer_errors['non_field_errors']}
            )
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            password = validated_data['password'],
            email = validated_data['email'],
            telegram = validated_data.get('telegram', ''),
            role = validated_data['role'],
        )

        return user

class UserNoPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'telegram', 'role')

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ('id', 'name', 'email', 'homepage', 'size')