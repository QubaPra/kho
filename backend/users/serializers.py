# backend/users/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'role', 'full_name')
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'validators': []},  # Disable unique validator for username
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],  # Use email as username
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],
            full_name=validated_data['full_name']
        )
        return user