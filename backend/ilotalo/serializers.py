from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from rest_framework import serializers
from .models import User, Organization, Event, NightResponsibility, DefectFault, Cleaning
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


"""
Serializers convert complex data such as model instances (User, Organization etc.) to Python datatypes.
Those can then be easily rendered to JSON, XML or other contenty types. Serializers can also deserialize incoming data
back to complex data types.
More info: https://www.django-rest-framework.org/api-guide/serializers/
"""

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

class UserNoPasswordSerializer(serializers.ModelSerializer):
    """
    Serializes a User object as JSON without displaying the hashed password
    """

    class Meta:
        model = User
        exclude = ('password',)

class OrganizationSerializer(serializers.ModelSerializer):
    """Serializes an Organization object as JSON"""

    user_set = UserNoPasswordSerializer(many=True, read_only=True)

    class Meta:
        model = Organization
        fields = '__all__'

    def validate_size(self, size):
        """Validates size when creating a new organization."""

        if int(size) not in [0, 1]:
            raise serializers.ValidationError("Organization size must be 0 or 1 (small or large).")
        return size

class UserSerializer(serializers.ModelSerializer):

    keys = OrganizationSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = '__all__'

    def validate_username(self, username):
        """Validates that the username does not contain @ symbol so it doesn't mess with the email login"""
        if "@" in username:
            raise serializers.ValidationError("Username cannot contain @ symbol")
        return username

    def validate_role(self, role):
        """Validates role when creating a new user. Limits: 1 <= role <= 7."""

        if int(role) < 1:
            raise serializers.ValidationError("Role can't be less than 1")
        if int(role) > 7:
            raise serializers.ValidationError("Role can't be higher than 7")
        return role

    def validate_telegram(self, tgname):
        """Validates telegram name when creating a new user. It must not be taken."""
        user_id = self.instance.id if self.instance else None
        if tgname:
            duplicate = User.objects.exclude(id=user_id).filter(telegram=tgname)
            if duplicate.exists():
                raise serializers.ValidationError("This telegram name is taken")
        return tgname

    def validate(self, data):
        """Validates password when creating a new user. We use Django's own validation function for this."""
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
        """Create the new user after data validation."""
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            email=validated_data["email"],
            telegram=validated_data.get("telegram", ""),
            role=validated_data["role"]
        )

        return user
    

class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating a user
    """

    keys = OrganizationSerializer(many=True, read_only=True)

    class Meta:
        model = User
        exclude = ('password',)  # Exclude password field from serialization

    def validate_role(self, role):
        """Validates role when updating a user. Limits: 1 <= role <= 7."""
        if int(role) < 1:
            raise serializers.ValidationError("Role can't be less than 1")
        if int(role) > 7:
            raise serializers.ValidationError("Role can't be higher than 7")
        return role

    def validate_telegram(self, tgname):
        """Checks if a telegram name is taken"""
        user_id = self.instance.id if self.instance else None
        if tgname:
            duplicate = User.objects.exclude(id=user_id).filter(telegram=tgname)
            if duplicate.exists():
                raise serializers.ValidationError("This telegram name is taken")
        return tgname

    def update(self, instance, validated_data):
        """Update the user instance with validated data."""
        instance.email = validated_data.get('email', instance.email)
        instance.telegram = validated_data.get('telegram', instance.telegram)
        instance.role = validated_data.get('role', instance.role)

        # Check if password is provided and update it if so
        password = validated_data.get('password')
        if password:
            validate_password(password)  # Validate the password
            instance.set_password(password)

        instance.save()
        return instance

class UserNoPasswordSerializer(serializers.ModelSerializer):
    """
    Serializes a User object as JSON without displaying the hashed password
    """

    keys = OrganizationSerializer(many=True, read_only=True)

    class Meta:
        model = User
        exclude = ('password',)

class EventSerializer(serializers.ModelSerializer):
    """Serializes an Event object as JSON"""

    organizer = OrganizationSerializer(read_only=True)

    class Meta:
        model = Event
        fields = '__all__'

class CreateEventSerializer(serializers.ModelSerializer):
    """Serializes an Event object as JSON"""

    class Meta:
        model = Event
        fields = '__all__'

class NightResponsibilitySerializer(serializers.ModelSerializer):
    """Serializes a NightResponsibility object as JSON"""

    organizations = OrganizationSerializer(many=True, read_only=True)
    user = UserNoPasswordSerializer(read_only=True)

    class Meta:
        model = NightResponsibility
        fields = '__all__'

class CreateNightResponsibilitySerializer(serializers.ModelSerializer):
    """Used for saving a NightResponsibility object to the database"""

    class Meta:
        model = NightResponsibility
        fields = '__all__'

class DefectFaultSerializer(serializers.ModelSerializer):
    """Serializes a DefectFault object as JSON"""

    user = UserNoPasswordSerializer(read_only=True)

    class Meta:
        model = DefectFault
        fields = '__all__'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("email", "")
        password = attrs.get("password", "")

        user = User.objects.filter(email=email).first() or User.objects.filter(username=email).first()

        if user and user.check_password(password):
            attrs["email"] = user.email
        else:
            raise serializers.ValidationError("Invalid login credentials")
        
        return super().validate(attrs)

class OrganizationOnlyNameSerializer(serializers.ModelSerializer):
    """Serializes an Organization object as JSON"""

    class Meta:
        model = Organization
        fields = ('name',)

class CreateCleaningSerializer(serializers.ModelSerializer):
    """Used for saving a Cleaning object to the database"""

    class Meta:
        model = Cleaning
        fields = '__all__'

class CleaningSerializer(serializers.ModelSerializer):
    """Used for saving a Cleaning object to the database"""

    big = OrganizationOnlyNameSerializer(read_only=True)
    small = OrganizationOnlyNameSerializer(read_only=True)

    class Meta:
        model = Cleaning
        exclude = ('id',)
