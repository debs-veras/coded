from rest_framework import viewsets, status, decorators
from rest_framework.permissions import IsAuthenticated
from .models import Activity, Submission
from .serializers import (
    ActivitySerializer, 
    ActivityDetailSerializer, 
    SubmissionSerializer, 
    SubmissionUpdateSerializer,
    SubmissionReadSerializer,
    SubmissionStudentSerializer
)

from apps.core.responses import standard_response
from apps.core.pagination import StandardResultsSetPagination

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all().order_by('-due_date')
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve', 'respostas']:
            return ActivityDetailSerializer
        return ActivitySerializer

    def get_queryset(self):
        # Para administradores, traz tudo. Para outros, filtragem ocorre nas actions
        if self.request.user.is_staff:
            return Activity.objects.all().order_by('-due_date')
        return Activity.objects.filter(is_active=True).order_by('-due_date')

    @decorators.action(detail=False, methods=['get'])
    def me(self, request):
        """
        GET /me/atividades?title=atividades
        ALUNO: atividades da sua turma
        PROFESSOR: atividades que criou
        """
        user = request.user
        title = request.query_params.get('title')
        
        if user.role == 'TEACHER':
            queryset = Activity.objects.filter(teacher=user).order_by('-due_date')
        elif user.role == 'STUDENT' and user.class_group:
            queryset = Activity.objects.filter(
                class_group=user.class_group, 
                status=Activity.StatusChoice.PUBLISHED
            ).order_by('-due_date')
        else:
            queryset = Activity.objects.none()

        # Aplicar filtro de busca pelo título se fornecido
        if title:
            queryset = queryset.filter(title__icontains=title)
            
        # Paginação opcional (usando o padrão do projeto)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return standard_response(data=serializer.data)

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    def create(self, request, *args, **kwargs):
        if request.user.role != 'TEACHER' and not request.user.is_staff:
            return standard_response(message="Apenas professores podem criar atividades.", status_code=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return standard_response(
            data=serializer.data, 
            message="Atividade criada com sucesso.", 
            status_code=status.HTTP_201_CREATED
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return standard_response(data=serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        if request.user.role != 'TEACHER' and not request.user.is_staff:
            return standard_response(message="Apenas professores podem editar atividades.", status_code=status.HTTP_403_FORBIDDEN)
            
        if instance.teacher != request.user and not request.user.is_staff:
            return standard_response(message="Você só pode editar suas próprias atividades.", status_code=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return standard_response(data=serializer.data, message="Atividade atualizada com sucesso.")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if request.user.role != 'TEACHER' and not request.user.is_staff:
            return standard_response(message="Apenas professores podem excluir atividades.", status_code=status.HTTP_403_FORBIDDEN)
            
        if instance.teacher != request.user and not request.user.is_staff:
            return standard_response(message="Você só pode excluir suas próprias atividades.", status_code=status.HTTP_403_FORBIDDEN)

        self.perform_destroy(instance)
        return standard_response(message="Atividade removida com sucesso.", status_code=status.HTTP_200_OK)

    @decorators.action(detail=True, methods=['get'])
    def respostas(self, request, pk=None):
        """
        GET /atividades/{id}/respostas/
        Exibe as respostas dos alunos para uma atividade específica (Apenas Professor da Atividade).
        """
        activity = self.get_object()
        
        if request.user.role != 'TEACHER' and not request.user.is_staff:
            return standard_response(message="Acesso restrito a professores.", status_code=status.HTTP_403_FORBIDDEN)
            
        if activity.teacher != request.user and not request.user.is_staff:
            return standard_response(message="Você só pode ver respostas das suas próprias atividades.", status_code=status.HTTP_403_FORBIDDEN)
            
        submissions = activity.submissions.all().order_by('-created_at')
        
        # Filtro por nome do aluno
        student_name = request.query_params.get('student_name')
        if student_name:
            submissions = submissions.filter(student__name__icontains=student_name)
            
        # Paginação opcional
        page = self.paginate_queryset(submissions)
        if page is not None:
            serializer = SubmissionReadSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = SubmissionReadSerializer(submissions, many=True)
        return standard_response(data=serializer.data)


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all().order_by('-created_at')
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_serializer_class(self):
        if self.action in ['partial_update', 'update']:
            return SubmissionUpdateSerializer
        return SubmissionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'TEACHER':
            return Submission.objects.filter(activity__teacher=user).order_by('-created_at')
        elif user.role == 'STUDENT':
            return Submission.objects.filter(student=user).order_by('-created_at')
        return Submission.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    def create(self, request, *args, **kwargs):
        if request.user.role != 'STUDENT' and not request.user.is_staff:
            return standard_response(message="Apenas alunos podem enviar respostas.", status_code=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return standard_response(
            data=serializer.data, 
            message="Resposta enviada com sucesso.", 
            status_code=status.HTTP_201_CREATED
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        
        # Validação de acesso: Aluno vê a dele, Professor vê das suas atividades
        if user.role == 'STUDENT' and instance.student != user:
            return standard_response(message="Acesso negado.", status_code=status.HTTP_403_FORBIDDEN)
        if user.role == 'TEACHER' and instance.activity.teacher != user:
            return standard_response(message="Acesso negado.", status_code=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance)
        return standard_response(data=serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        if user.role != 'STUDENT' and not user.is_staff:
            return standard_response(message="Apenas o aluno pode remover sua resposta.", status_code=status.HTTP_403_FORBIDDEN)
        
        if instance.student != user and not user.is_staff:
            return standard_response(message="Você não pode excluir a resposta de outro aluno.", status_code=status.HTTP_403_FORBIDDEN)

        self.perform_destroy(instance)
        return standard_response(message="Resposta removida com sucesso.", status_code=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        """
        PATCH /respostas/{id}/
        Suporta edição pelo Aluno (conteúdo) e Professor (nota/feedback).
        """
        instance = self.get_object()
        user = request.user

        # Validação de permissão: Professor só edita o que criou, Aluno só edita o que enviou
        if user.role == 'TEACHER' and instance.activity.teacher != user and not user.is_staff:
            return standard_response(message="Permissão negada para esta correção.", status_code=status.HTTP_403_FORBIDDEN)
        
        if user.role == 'STUDENT' and instance.student != user:
            return standard_response(message="Você não pode editar a resposta de outro aluno.", status_code=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return standard_response(data=serializer.data, message="Atualização realizada com sucesso.")

    @decorators.action(detail=False, methods=['get'])
    def me(self, request):
        """
        GET /me/respostas (Somente ALUNO)
        """
        if request.user.role != 'STUDENT' and not request.user.is_staff:
            return standard_response(message="Acesso restrito a alunos.", status_code=status.HTTP_403_FORBIDDEN)
            
        title = request.query_params.get('title')
        queryset = Submission.objects.filter(student=request.user).order_by('-created_at')

        # Filtro opcional por título da atividade
        if title:
            queryset = queryset.filter(activity__title__icontains=title)
            
        # Paginação opcional
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = SubmissionStudentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = SubmissionStudentSerializer(queryset, many=True)
        return standard_response(data=serializer.data)
