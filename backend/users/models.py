from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, login, full_name, password=None, **extra_fields):
        if not login:
            raise ValueError('The Login field must be set')
        login = self.normalize_email(login)
        user = self.model(login=login, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, login, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')

        return self.create_user(login, full_name, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLES = (
        ('Kandydat', 'Kandydat'),
        ('Członek kapituły', 'Członek kapituły'),
        ('Administrator', 'Administrator'),
    )
    login = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLES, default='Kandydat')
    last_login = models.DateTimeField(auto_now=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'login'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.login