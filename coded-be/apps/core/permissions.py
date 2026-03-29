from rest_framework import permissions
from django.contrib.auth import get_user_model

User = get_user_model()

class HasRole(permissions.BasePermission):
    """
    Permissão genérica que permite acesso baseado em uma lista de cargos.
    O cargo 'ADMIN' ou 'is_staff' sempre tem acesso total.
    """
    def __init__(self, allowed_roles=None):
        super().__init__()
        self.allowed_roles = allowed_roles or []

    def __call__(self):
        return self

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        # Admin sempre tem acesso total no sistema
        if request.user.role == User.RoleChoice.ADMIN or request.user.is_staff:
            return True
            
        # Verifica se o cargo do usuário está na lista permitida
        return request.user.role in self.allowed_roles

class IsAdminUser(HasRole):
    """Permite acesso apenas a administradores."""
    def __init__(self):
        super().__init__(allowed_roles=[User.RoleChoice.ADMIN])

class IsTeacherUser(HasRole):
    """Permite acesso apenas a professores."""
    def __init__(self):
        super().__init__(allowed_roles=[User.RoleChoice.TEACHER])

class IsStudentUser(HasRole):
    """Permite acesso apenas a estudantes."""
    def __init__(self):
        super().__init__(allowed_roles=[User.RoleChoice.STUDENT])
