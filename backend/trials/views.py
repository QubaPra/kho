# backend/trials/views.py
from rest_framework import viewsets, generics, mixins
from .models import Trial
from .serializers import TrialSerializer, TrialListSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class TrialListView(generics.ListAPIView):
    queryset = Trial.objects.all()
    serializer_class = TrialListSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        self.queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class TrialMeView(generics.RetrieveUpdateDestroyAPIView, generics.CreateAPIView):
    serializer_class = TrialSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Trial.objects.get(user=self.request.user)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TrialDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trial.objects.all()
    serializer_class = TrialSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'