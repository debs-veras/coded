from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, StudentDashboardView

router = DefaultRouter(trailing_slash=False)
router.register(r'', UserViewSet, basename='user-management')

urlpatterns = [
    path('dashboard', StudentDashboardView.as_view(), name='student-dashboard'),
    path('', include(router.urls)),
]
