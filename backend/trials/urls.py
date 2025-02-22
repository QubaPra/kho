# backend/trials/urls.py
from rest_framework.routers import DefaultRouter
from .views import TrialViewSet, TaskViewSet

router = DefaultRouter()
router.register(r'trials', TrialViewSet)
router.register(r'tasks', TaskViewSet)

urlpatterns = router.urls