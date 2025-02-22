# backend/trials/serializers.py
from rest_framework import serializers
from .models import Trial
from tasks.serializers import TaskSerializer

class TrialSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)


    class Meta:
        model = Trial
        fields = '__all__'