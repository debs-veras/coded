from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClassGroupViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r'', ClassGroupViewSet, basename='class-group')

urlpatterns = [
    path('', include(router.urls)),
]
