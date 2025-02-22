# backend/trials/views.py
from rest_framework import viewsets
from .models import Trial
from .serializers import TrialSerializer
from rest_framework.permissions import IsAuthenticated

class TrialViewSet(viewsets.ModelViewSet):
    queryset = Trial.objects.all()
    serializer_class = TrialSerializer
    permission_classes = [IsAuthenticated]