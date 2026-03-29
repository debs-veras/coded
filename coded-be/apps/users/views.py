from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import Avg

from .serializers import UserCRUDSerializer, UserRegisterSerializer, ChangePasswordSerializer
from apps.core.permissions import IsAdminUser
from apps.core.pagination import StandardResultsSetPagination
from apps.core.responses import standard_response
from apps.activities.models import Activity, Submission
from apps.activities.serializers import ActivityDetailSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserCRUDSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = User.objects.all().order_by('-date_joined')
        
        # Filtros solicitados pelo frontend
        name = self.request.query_params.get('name')
        email = self.request.query_params.get('email')
        role = self.request.query_params.get('role')
        
        if name:
            queryset = queryset.filter(name__icontains=name)
        if email:
            queryset = queryset.filter(email__icontains=email)
        if role:
            queryset = queryset.filter(role=role)
            
        return queryset

    def get_permissions(self):
        if self.action == 'change_password':
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            # get_paginated_response já utiliza o format solicitado
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return standard_response(data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return standard_response(data=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = UserRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return standard_response(
            data=serializer.data,
            message="Usuário criado com sucesso.",
            status_code=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return standard_response(
            data=serializer.data,
            message="Usuário atualizado com sucesso."
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return standard_response(
            message="Usuário removido com sucesso.",
            status_code=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        """
        Ação para o usuário logado alterar sua própria senha.
        """
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return standard_response(
            message="Senha alterada com sucesso.",
            status_code=status.HTTP_200_OK
        )


class StudentDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Validar se o usuário é um estudante
        if user.role != 'STUDENT':
            return standard_response(
                success=False,
                message="Acesso restrito a estudantes.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        # Validar se o estudante pertence a uma turma
        if not user.class_group:
            return standard_response(
                data={
                    "stats": {
                        "total_activities": 0,
                        "completed_activities": 0,
                        "pending_activities": 0,
                        "average_score": 0
                    },
                    "activities_today": [],
                    "upcoming_activities": [],
                    "recent_submissions": []
                },
                message="Estudante não está vinculado a nenhuma turma."
            )

        now = timezone.now()
        today = now.date()
        
        # Atividades da turma do estudante
        class_activities = Activity.objects.filter(
            class_group=user.class_group,
            status=Activity.StatusChoice.PUBLISHED
        )
        
        # Submissões do estudante
        student_submissions = Submission.objects.filter(student=user)
        submitted_activity_ids = student_submissions.values_list('activity_id', flat=True)
        
        # 1. Estatísticas
        total_activities_count = class_activities.count()
        completed_activities_count = student_submissions.count()
        
        # Atividades pendentes (não submetidas e ainda dentro do prazo)
        pending_activities = class_activities.exclude(id__in=submitted_activity_ids)
        pending_activities_count = pending_activities.count()
        
        # Média de notas
        average_score = student_submissions.filter(score__isnull=False).aggregate(Avg('score'))['score__avg'] or 0
        
        # 2. Atividades para hoje
        activities_today = class_activities.filter(due_date__date=today)
        
        # 3. Próximas Atividades (prazo futuro, não é hoje, não submetida)
        upcoming_activities = pending_activities.filter(due_date__gt=now).exclude(due_date__date=today).order_by('due_date')[:5]
        
        data = {
            "stats": {
                "total_activities": total_activities_count,
                "completed_activities": completed_activities_count,
                "pending_activities": pending_activities_count,
                "average_score": round(float(average_score), 2)
            },
            "activities_today": ActivityDetailSerializer(activities_today, many=True).data,
            "upcoming_activities": ActivityDetailSerializer(upcoming_activities, many=True).data,
            "class_info": {
                "name": user.class_group.name,
                "teacher": user.class_group.teacher.name if user.class_group.teacher else None
            }
        }
        
        return standard_response(
            data=data,
            message="Dashboard do estudante carregado com sucesso."
        )
