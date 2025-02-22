# backend/trials/admin.py
from django.contrib import admin
from .models import Trial, Task

admin.site.register(Trial)
admin.site.register(Task)