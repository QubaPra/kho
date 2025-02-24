# backend/trials/models.py
from django.db import models
from users.models import User

class Team(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name



class Trial(models.Model):
    RANK_CHOICES = (
        ('mł.', 'mł.'),
        ('wyw.', 'wyw.'),
        ('ćw.', 'ćw.'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rank = models.CharField(max_length=4, choices=RANK_CHOICES)
    email = models.EmailField()
    birth_date = models.DateField()
    team = models.CharField(max_length=100)
    mentor_mail = models.EmailField(blank=True)
    mentor_name = models.CharField(max_length=100, blank=True)
    created_time = models.DateTimeField(auto_now_add=True)
    edited_time = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=100, default='do akceptacji przez opiekuna')
    