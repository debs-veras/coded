from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityViewSet, SubmissionViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r'atividades', ActivityViewSet, basename='activity')
router.register(r'respostas', SubmissionViewSet, basename='submission')

urlpatterns = [
    # Atalhos /me/
    path('me/atividades', ActivityViewSet.as_view({'get': 'me'}), name='me-atividades'),
    path('me/respostas', SubmissionViewSet.as_view({'get': 'me'}), name='me-respostas'),
    
    # Rotas padrão do router
    path('', include(router.urls)),
]
