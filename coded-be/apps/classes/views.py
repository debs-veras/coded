from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from .models import ClassGroup
from .serializers import ClassGroupSerializer, ClassGroupDetailSerializer
from apps.core.permissions import IsAdminUser
from apps.core.responses import standard_response
from apps.core.pagination import StandardResultsSetPagination


class ClassGroupViewSet(viewsets.ModelViewSet):
    queryset = ClassGroup.objects.all().order_by('-created_at')
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        # O manager 'objects' já filtra is_active=True, mas reforçamos aqui para clareza
        queryset = ClassGroup.objects.filter(is_active=True).order_by('-created_at')
        
        # Filtros de busca
        name = self.request.query_params.get('name')
        teacher = self.request.query_params.get('teacher')
        
        if name:
            queryset = queryset.filter(name__icontains=name)
        if teacher:
            queryset = queryset.filter(teacher_id=teacher)
            
        return queryset

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ClassGroupDetailSerializer
        return ClassGroupSerializer

    def get_permissions(self):
        if self.action == 'list':
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return standard_response(data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return standard_response(data=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return standard_response(
            data=serializer.data,
            message="Turma criada com sucesso.",
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
            message="Turma atualizada com sucesso."
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return standard_response(
            message="Turma removida com sucesso.",
            status_code=status.HTTP_200_OK
        )
