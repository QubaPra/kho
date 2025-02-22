# backend/trials/serializers.py
from rest_framework import serializers
from .models import Trial, Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TrialSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Trial
        fields = '__all__'