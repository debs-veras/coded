from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para o perfil do usuário logado.
    """
    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'phone', 'role', 'birth_date', 'cpf', 'date_joined', 'last_login', 'updated_at')
        read_only_fields = ('id',)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Personaliza o payload do token JWT para incluir dados do usuário.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        user_data = UserSerializer(self.user).data
        data.update(user_data)
        return data
