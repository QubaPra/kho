from django.db import models
from users.models import User
from trials.models import Trial

class Comment(models.Model):
    trial = models.ForeignKey(Trial, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)  
