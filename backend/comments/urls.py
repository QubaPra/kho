# backend/comments/urls.py
from django.urls import path
from .views import CommentView, CommentTrialView

urlpatterns = [
    path('comments/', CommentView.as_view(), name='comments'),
    path('comments/<int:pk>/', CommentTrialView.as_view(), name='comments-trial'),
]