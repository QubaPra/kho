from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.hashers import make_password


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'login', 'password', 'full_name')
        extra_kwargs = {
            'password': {'write_only': True},
            'login': {'validators': []},  # Disable unique validator for login
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            login=validated_data['login'],  # Use login as username
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            role='Kandydat'  # Set default role to 'Kandydat'
        )
        return user