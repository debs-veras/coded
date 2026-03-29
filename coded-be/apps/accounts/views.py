from rest_framework import generics, permissions, status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    UserSerializer, 
    CustomTokenObtainPairSerializer
)
from apps.core.responses import standard_response
from apps.core.permissions import HasRole

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return standard_response(
            data=response.data,
            message="Login realizado com sucesso!"
        )

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return standard_response(
            data=response.data,
            message="Token renovado com sucesso!"
        )

class VerifyUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (HasRole([User.RoleChoice.ADMIN, User.RoleChoice.TEACHER, User.RoleChoice.STUDENT]),)

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return standard_response(
            data=serializer.data,
            message="Usuário autenticado e validado."
        )

class LogoutView(generics.GenericAPIView):
    permission_classes = (HasRole([User.RoleChoice.ADMIN, User.RoleChoice.TEACHER, User.RoleChoice.STUDENT]),)

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return standard_response(
                    message="Refresh token é obrigatório.",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return standard_response(
                message="Logout realizado com sucesso! Token invalidado."
            )
        except Exception as e:
            return standard_response(
                message="Token inválido ou já expirado.",
                status_code=status.HTTP_400_BAD_REQUEST
            )
