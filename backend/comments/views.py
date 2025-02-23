from rest_framework import viewsets
from .models import Comment
from .serializers import CommentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

class CommentView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CommentTrialView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        trial_id = self.kwargs['pk']
        return Comment.objects.filter(trial=trial_id)