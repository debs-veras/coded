from rest_framework import serializers
from django.contrib.auth import get_user_model
import re

from .models import UserAddress

User = get_user_model()


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = ('cep', 'logradouro', 'numero', 'bairro', 'uf', 'localidade')

    def validate_cep(self, value):
        if value:
            clean_cep = re.sub(r'\D', '', value)
            if len(clean_cep) != 8:
                raise serializers.ValidationError("O CEP deve ter 8 dígitos numéricos.")
            return clean_cep
        return value

class UserBaseSerializer(serializers.ModelSerializer):
    """
    Serializer base com validações comuns para usuários.
    """
    address = AddressSerializer(required=False)

    def validate_phone(self, value):
        if value:
            # Mantém apenas os dígitos do telefone
            clean_phone = re.sub(r'\D', '', value)
            if len(clean_phone) < 10 or len(clean_phone) > 11:
                raise serializers.ValidationError("O telefone deve ter 10 ou 11 dígitos numéricos.")
            return clean_phone
        return value

    def validate_cpf(self, value):
        if value:
            # Limpa o CPF (mantém apenas dígitos)
            clean_cpf = re.sub(r'\D', '', value)
            # Verifica se o CPF já esta cadastrado (excluindo a própria instância no caso de update)
            user_id = self.instance.id if hasattr(self, 'instance') and self.instance else None
            if User.objects.exclude(id=user_id).filter(cpf=clean_cpf).exists():
                raise serializers.ValidationError("Este CPF já está cadastrado.")
            return clean_cpf
        return value

    def validate_email(self, value):
        user_id = self.instance.id if hasattr(self, 'instance') and self.instance else None
        if User.objects.exclude(id=user_id).filter(email=value).exists():
            raise serializers.ValidationError("Este e-mail já está cadastrado.")
        return value


class UserSimpleSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para exibição de dados básicos de usuários.
    """
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'cpf', 'role')

class UserCRUDSerializer(UserBaseSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'email', 'name', 'role', 'phone', 
            'birth_date', 'cpf', 'is_active', 'is_staff', 
            'date_joined', 'updated_at', 'last_login', 'address', 'class_group'
        )
        read_only_fields = ('id', 'date_joined', 'updated_at', 'last_login')

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)
        # Garante que a senha não possa ser editada por aqui
        validated_data.pop('password', None)
        
        user = super().update(instance, validated_data)
        
        if address_data:
            if hasattr(user, 'address'):
                # Atualiza endereço existente
                for attr, value in address_data.items():
                    setattr(user.address, attr, value)
                user.address.save()
            else:
                # Cria novo endereço caso não exista
                UserAddress.objects.create(user=user, **address_data)
                
        return user

class UserRegisterSerializer(UserBaseSerializer):
    """
    Serializer para criação de novos usuários (utilizado por administradores ou registro público).
    """
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'name', 'password', 'password_confirm', 'phone', 'role', 'birth_date', 'cpf', 'address', 'class_group')

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})
            
        # Validação condicional de endereço
        role = data.get('role', User.RoleChoice.STUDENT)
        if role in [User.RoleChoice.TEACHER, User.RoleChoice.STUDENT]:
            if not data.get('address'):
                raise serializers.ValidationError({
                    "address": "O endereço é obrigatório para Professores e Estudantes."
                })
            
            # Garante que todos os campos do endereço estejam preenchidos no cadastro
            address_data = data.get('address')
            required_fields = ['cep', 'logradouro', 'numero', 'bairro', 'uf', 'localidade']
            for field in required_fields:
                if not address_data or not address_data.get(field):
                    raise serializers.ValidationError({
                        "address": {field: f"O campo {field} é obrigatório no endereço."}
                    })
        
        # Validação de Turma para Estudantes (Obrigatório)
        if role == User.RoleChoice.STUDENT:
            class_group = data.get('class_group')
            if not class_group:
                raise serializers.ValidationError({
                    "class_group": "A seleção de uma turma é obrigatória para estudantes."
                })
            
            # Garante que a turma esteja ativa
            if not class_group.is_active:
                raise serializers.ValidationError({
                    "class_group": "A turma selecionada não está mais disponível."
                })
                    
        return data

    def create(self, validated_data):
        address_data = validated_data.pop('address', None)
        validated_data.pop('password_confirm')
        role = validated_data.get('role', User.RoleChoice.STUDENT)
        
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data.get('name', ''),
            password=validated_data['password'],
            phone=validated_data.get('phone', ''),
            role=role,
            birth_date=validated_data.get('birth_date'),
            cpf=validated_data.get('cpf'),
            class_group=validated_data.get('class_group')
        )
        
        if address_data:
            UserAddress.objects.create(user=user, **address_data)
            
        return user

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer para alteração de senha do próprio usuário.
    """
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        if data['new_password'] != data['password_confirm']:
            raise serializers.ValidationError({"new_password": "As novas senhas não coincidem."})
        return data

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("A senha atual está incorreta.")
        return value
