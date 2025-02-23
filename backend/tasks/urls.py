# backend/tasks/urls.py
from django.urls import path
from .views import TaskMeView, TaskDetailView

urlpatterns = [
    path('tasks/me', TaskMeView.as_view(), name='task-me'),
    path('tasks/<int:pk>', TaskDetailView.as_view(), name='task-detail'),
]