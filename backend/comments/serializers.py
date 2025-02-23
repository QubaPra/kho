# backend/comment/serializers.py
from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'