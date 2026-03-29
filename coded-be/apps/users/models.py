from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O E-mail é obrigatório.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', CustomUser.RoleChoice.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser deve ter is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser deve ter is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    class RoleChoice(models.TextChoices):
        ADMIN = 'ADMIN', 'Administrador'
        TEACHER = 'TEACHER', 'Professor'
        STUDENT = 'STUDENT', 'Estudante'

    email = models.EmailField(unique=True, verbose_name="E-mail")
    name = models.CharField(max_length=150, verbose_name="Nome")
    
    role = models.CharField(
        max_length=20,
        choices=RoleChoice.choices,
        default=RoleChoice.STUDENT,
        verbose_name="Cargo"
    )
    phone = models.CharField(
        max_length=20, 
        verbose_name="Telefone"
    )
    birth_date = models.DateField(
        verbose_name="Data de Nascimento"
    )
    cpf = models.CharField(
        max_length=14, 
        unique=True, 
        verbose_name="CPF"
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    # Estudantes pertencem a uma turma (1:N)
    class_group = models.ForeignKey(
        'classes.ClassGroup',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='students',
        verbose_name="Turma"
    )
    
    date_joined = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone', 'birth_date', 'cpf']

    def __str__(self):
        return self.email


class UserAddress(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='address')
    cep = models.CharField(max_length=8, verbose_name="CEP")
    logradouro = models.CharField(max_length=255, verbose_name="Logradouro")
    numero = models.CharField(max_length=20, verbose_name="Número")
    bairro = models.CharField(max_length=100, verbose_name="Bairro")
    uf = models.CharField(max_length=2, verbose_name="UF")
    localidade = models.CharField(max_length=255, verbose_name="Localidade")

    def __str__(self):
        return f"{self.logradouro}, {self.numero} - {self.user.email}"
