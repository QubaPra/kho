# backend/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLES = (
        ('Kandydat', 'Kandydat'),
        ('Członek kapituły', 'Członek kapituły'),
        ('Administrator', 'Administrator'),
    )
    role = models.CharField(max_length=20, choices=ROLES, default='user')
    full_name = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        self.email = self.username  # Ensure email is used as username
        super().save(*args, **kwargs)