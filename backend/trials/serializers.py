# backend/trials/serializers.py
from rest_framework import serializers
from .models import Trial
from tasks.serializers import TaskSerializer
from comments.serializers import CommentSerializer

class TrialSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    user = serializers.CharField(source='user.full_name', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Trial
        fields = '__all__'

months = {
            '01': 'styczeń', '02': 'luty', '03': 'marzec', '04': 'kwiecień',
            '05': 'maj', '06': 'czerwiec', '07': 'lipiec', '08': 'sierpień',
            '09': 'wrzesień', '10': 'październik', '11': 'listopad', '12': 'grudzień'
        }

class TrialListSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    user = serializers.CharField(source='user.full_name', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    end_date = serializers.SerializerMethodField()

    class Meta:
        model = Trial
        fields = '__all__'

    def get_end_date(self, obj):
        tasks = obj.tasks.all()
        if not tasks:
            return None
        valid_end_dates = [task.end_date for task in tasks if task.end_date]
        if not valid_end_dates:
            return None
        latest_end_date = max(valid_end_dates)
        if latest_end_date:
            month, year = latest_end_date.split('-')
            month_name = months.get(month, '')
            return f"{month_name} {year}"
        return None