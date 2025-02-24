# backend/users/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from trials.models import Trial  # Import Trial model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    has_trial = serializers.SerializerMethodField()
    is_mentor = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'login', 'full_name', 'role', 'last_login', 'date_joined', 'password', 'has_trial', 'is_mentor')
        extra_kwargs = {
            'password': {'write_only': True},
            'login': {'validators': []},  # Disable unique validator for login
        }

    def get_has_trial(self, obj):
        return Trial.objects.filter(user=obj).exists()

    def get_is_mentor(self, obj):
        return Trial.objects.filter(mentor_mail=obj.login).exists()

    def create(self, validated_data):
        user = User.objects.create_user(
            login=validated_data['login'],  # Use login as username
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            role='Kandydat'  # Set default role to 'Kandydat'
        )
        return user

    def update(self, instance, validated_data):
        instance.login = validated_data.get('login', instance.login)
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.role = validated_data.get('role', instance.role)  # Dodaj aktualizację roli
        if 'password' in validated_data:
            instance.password = make_password(validated_data['password'])
        instance.save()
        return instance