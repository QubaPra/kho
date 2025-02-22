# backend/trials/views.py
from rest_framework import viewsets
from .models import Trial, Task
from .serializers import TrialSerializer, TaskSerializer
from rest_framework.permissions import IsAuthenticated

class TrialViewSet(viewsets.ModelViewSet):
    queryset = Trial.objects.all()
    serializer_class = TrialSerializer
    permission_classes = [IsAuthenticated]

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]