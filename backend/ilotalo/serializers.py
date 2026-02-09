import logging
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from django.db.models import Q
from rest_framework import serializers
from .models import User, Organization, Event, NightResponsibility, DefectFault, Cleaning, CleaningSupplies
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .config import Role

logger = logging.getLogger(__name__)


"""
Serializers convert complex data such as model instances (User, Organization etc.) to Python datatypes.
Those can then be easily rendered to JSON, XML or other contenty types. Serializers can also deserialize incoming data
back to complex data types.
More info: https://www.django-rest-framework.org/api-guide/serializers/
"""


class UserNoPasswordSerializer(serializers.ModelSerializer):
    """
    Serializes a User object as JSON without displaying the hashed password
    """

    class Meta:
        model = User
        exclude = ('password',)


class UserMinimalSerializer(serializers.ModelSerializer):
    """
    Minimal serializer for user id and username only
    """
    class Meta:
        model = User
        fields = ('id', 'username')


class OrganizationSerializer(serializers.ModelSerializer):
    """Serializes an Organization object as JSON"""

    user_set = UserNoPasswordSerializer(many=True, read_only=True)

    class Meta:
        model = Organization
        fields = '__all__'

    def validate_size(self, size):
        """Validates size when creating a new organization."""

        if int(size) not in [0, 1]:
            raise serializers.ValidationError(
                "Organization size must be 0 or 1 (small or large).")
        return size


class OrganizationListSerializer(serializers.ModelSerializer):
    """Serializes an Organization object as JSON without heavy nested relationships"""

    user_set = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = '__all__'

    def get_user_set(self, obj):
        # Only include user count if explicitly requested via query parameter
        request = self.context.get('request')
        if request and request.query_params.get('include_user_count') == 'true':
            # Count users with this organization in their keys
            count = User.objects.filter(keys=obj).count()
            return [None] * count
        return None


class OrganizationNameSerializer(serializers.ModelSerializer):
    """Minimal serializer for organization name and ID only to boost performance"""
    class Meta:
        model = Organization
        fields = ('id', 'name')


class UserSerializer(serializers.ModelSerializer):

    keys = OrganizationSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = '__all__'

    def validate_username(self, username):
        """Validates that the username does not contain @ symbol and is not already taken."""
        if "@" in username:
            raise serializers.ValidationError(
                "Username cannot contain @ symbol")
        user_id = self.instance.id if self.instance else None
        if username:
            duplicate = User.objects.all()
            if user_id:
                duplicate = duplicate.exclude(id=user_id)
            duplicate = duplicate.filter(username=username)
            if duplicate.exists():
                raise serializers.ValidationError(
                    "This username is already taken")
        return username

    def validate_email(self, email):
        """Validates that the email is not already taken."""
        user_id = self.instance.id if self.instance else None
        if email:
            duplicate = User.objects.all()
            if user_id:
                duplicate = duplicate.exclude(id=user_id)
            duplicate = duplicate.filter(email=email)
            if duplicate.exists():
                raise serializers.ValidationError(
                    "This email is already in use")
        return email

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
            duplicate = User.objects.all()
            if user_id:
                duplicate = duplicate.exclude(id=user_id)
            duplicate = duplicate.filter(telegram=tgname)
            if duplicate.exists():
                raise serializers.ValidationError(
                    "This telegram name is taken")
        return tgname

    def validate(self, attrs):
        """Validates password when creating a new user. We use Django's own validation function for this."""
        password = attrs.get("password")

        if password:
            try:
                validate_password(password)
            except exceptions.ValidationError as e:
                serializer_errors = serializers.as_serializer_error(e)
                raise serializers.ValidationError(
                    {"password": serializer_errors["non_field_errors"]}
                )
        return attrs

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
    current_password = serializers.CharField(
        write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True, 'required': False, 'allow_blank': True},
            'username': {'required': False},
            'email': {'required': False},
            'role': {'required': False},
        }

    def validate_username(self, username):
        """Validates that the username does not contain @ symbol and is not already taken."""
        if "@" in username:
            raise serializers.ValidationError(
                "Username cannot contain @ symbol")
        user_id = self.instance.id if self.instance else None
        if username:
            duplicate = User.objects.all()
            if user_id:
                duplicate = duplicate.exclude(id=user_id)
            duplicate = duplicate.filter(username=username)
            if duplicate.exists():
                raise serializers.ValidationError(
                    "This username is already taken")
        return username

    def validate_email(self, email):
        """Validates that the email is not already taken."""
        user_id = self.instance.id if self.instance else None
        if email:
            duplicate = User.objects.all()
            if user_id:
                duplicate = duplicate.exclude(id=user_id)
            duplicate = duplicate.filter(email=email)
            if duplicate.exists():
                raise serializers.ValidationError(
                    "This email is already in use")
        return email

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
            duplicate = User.objects.all()
            if user_id:
                duplicate = duplicate.exclude(id=user_id)
            duplicate = duplicate.filter(telegram=tgname)
            if duplicate.exists():
                raise serializers.ValidationError(
                    "This telegram name is taken")
        return tgname

    def validate(self, attrs):
        """Validates password when updating a user."""
        current_password = attrs.get("current_password")
        new_password = attrs.get("password")

        # Skip validation if no fields are actually being changed (might happen in some UI flows)
        if not self.instance:
            return attrs

        request_user = self.context['request'].user

        # Bypass current_password check if LEPPISPJ is updating another user
        if request_user.role == Role.LEPPISPJ.value and self.instance.id != request_user.id:
            # If a new password is provided, validate it. Current_password not needed here.
            if new_password:
                try:
                    validate_password(new_password)
                except exceptions.ValidationError as e:
                    serializer_errors = serializers.as_serializer_error(e)
                    raise serializers.ValidationError(
                        {"password": serializer_errors["non_field_errors"]}
                    )
            return attrs  # LEPPISPJ can update other fields without knowing target's password

        # For self-updates or non-LEPPISPJ updates of other users:
        # Only require current_password if a new password is explicitly being set
        if new_password:
            if not current_password or not self.instance.check_password(current_password):
                raise serializers.ValidationError(
                    {"current_password": "Invalid current password."})
            try:
                validate_password(new_password)
            except exceptions.ValidationError as e:
                serializer_errors = serializers.as_serializer_error(e)
                raise serializers.ValidationError(
                    {"password": serializer_errors["non_field_errors"]}
                )
        return attrs

    def update(self, instance, validated_data):
        """Update the user instance with validated data."""
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.telegram = validated_data.get('telegram', instance.telegram)
        instance.role = validated_data.get('role', instance.role)
        instance.rights_for_reservation = validated_data.get(
            'rights_for_reservation', instance.rights_for_reservation)

        # Check if password is provided and not empty, and update it if so
        password = validated_data.get('password')
        if password:
            instance.set_password(password)

        instance.save()
        return instance


class EventSerializer(serializers.ModelSerializer):
    """Serializes an Event object as JSON - Full version"""

    organizer = OrganizationSerializer(read_only=True)
    created_by = UserNoPasswordSerializer(read_only=True)

    class Meta:
        model = Event
        fields = '__all__'


class EventListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for calendar and list views - Nested object for frontend compatibility"""
    organizer = OrganizationNameSerializer(read_only=True)
    created_by = UserMinimalSerializer(read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'start', 'end', 'title',
                  'organizer', 'responsible', 'open', 'room', 'description', 'created_by')


class CreateEventSerializer(serializers.ModelSerializer):
    """Used for creating an event"""

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('created_by',)

    def validate(self, attrs):
        """
        Verify that organizer is provided.
        created_by is set in the view.
        """
        if not attrs.get('organizer'):
            raise serializers.ValidationError(
                {"organizer": "Organizer is required."})
        return attrs


class NightResponsibilitySerializer(serializers.ModelSerializer):
    """Serializes a NightResponsibility object as JSON"""

    organizations = OrganizationSerializer(many=True, read_only=True)
    user = UserNoPasswordSerializer(read_only=True)
    created_by = UserNoPasswordSerializer(read_only=True)

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

        # Search by email or username in a single query
        user = User.objects.filter(Q(email=email) | Q(username=email)).first()

        if user:
            # Handle first login for role 1 (admin)
            if user.role == 1 and user.first_login:
                user.first_login = False
                user.save()
                # Skip password check for first admin login as per existing logic
            else:
                is_valid = user.check_password(password)
                if not is_valid:
                    raise serializers.ValidationError(
                        "Invalid login credentials")

            # Set self.user as expected by SimpleJWT
            self.user = user

            # Generate tokens manually (equivalent to TokenObtainPairSerializer.validate)
            refresh = self.get_token(self.user)
            data = {}
            data['refresh'] = str(refresh)
            data['access'] = str(refresh.access_token)  # type: ignore
            return data

        raise serializers.ValidationError("User not found")


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


class CleaningSuppliesSerializer(serializers.ModelSerializer):
    """Serializes a Cleaningsupplies tool"""

    user = UserNoPasswordSerializer(read_only=True)

    class Meta:
        model = CleaningSupplies
        fields = '__all__'
