# backend/users/urls.py
from django.urls import path
from .views import RegisterView, LoginView, UserListView, UserDetailView, UserMeView, ChangePasswordView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:id>/', UserDetailView.as_view(), name='user-detail'),
    path('users/me/', UserMeView.as_view(), name='user-me'),
    path('users/me/password/', ChangePasswordView.as_view(), name='change-password'),

]