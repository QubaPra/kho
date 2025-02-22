# backend/trials/models.py
from django.db import models
from users.models import User

class Team(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50)
    font_color = models.CharField(max_length=50)
    bg_color = models.CharField(max_length=50)
    dark_font_color = models.CharField(max_length=50)
    dark_bg_color = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Trial(models.Model):
    RANK_CHOICES = (
        ('mł.', 'mł.'),
        ('wyw.', 'wyw.'),
        ('ćw.', 'ćw.'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rank = models.CharField(max_length=4, choices=RANK_CHOICES)
    email = models.EmailField()
    birth_date = models.DateField()
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True)
    mentor_mail = models.EmailField()
    mentor_name = models.CharField(max_length=100)
    created_time = models.DateTimeField(auto_now_add=True)
    edited_time = models.DateTimeField(auto_now=True)

class Task(models.Model):
    trial = models.ForeignKey(Trial, on_delete=models.CASCADE, related_name='tasks')
    content = models.TextField()
    categories = models.ManyToManyField(Category)
    end_date = models.CharField(max_length=7)  # Format: MM-YYYY
    is_done = models.BooleanField(default=False)