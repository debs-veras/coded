from rest_framework import serializers
from django.utils import timezone
from .models import Activity, Submission
from django.contrib.auth import get_user_model
from apps.users.serializers import UserSimpleSerializer

User = get_user_model()


class ActivitySerializer(serializers.ModelSerializer):
    """
    Serializer para criação e edição de atividades.
    """
    class Meta:
        model = Activity
        fields = (
            'id', 'title', 'description', 'due_date', 
            'class_group', 'teacher', 'max_score', 
            'status', 'created_at'
        )
        read_only_fields = ('id', 'created_at', 'teacher')

    def validate_due_date(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("A data de entrega não pode ser no passado.")
        return value

    def validate_class_group(self, value):
        # Opcional: Validar se o professor pertence à turma (se houver essa regra no futuro)
        return value


class ActivityDetailSerializer(serializers.ModelSerializer):
    """
    Serializer detalhado para visualização de atividades.
    """
    teacher_name = serializers.ReadOnlyField(source='teacher.name')
    class_name = serializers.ReadOnlyField(source='class_group.name')
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = (
            'id', 'title', 'description', 'due_date', 
            'max_score', 'status', 'teacher_name', 
            'class_name', 'is_expired', 'created_at'
        )

    def get_is_expired(self, obj):
        return obj.due_date < timezone.now()


class SubmissionSerializer(serializers.ModelSerializer):
    """
    Serializer para envio de respostas pelos alunos.
    """
    class Meta:
        model = Submission
        fields = ('id', 'activity', 'student', 'content', 'score', 'feedback', 'created_at', 'updated_at')
        read_only_fields = ('id', 'student', 'score', 'feedback', 'created_at', 'updated_at')

    def validate(self, data):
        activity = data.get('activity')
        student = self.context['request'].user

        # 1. Validar se a atividade está ativa e publicada
        if activity.status != Activity.StatusChoice.PUBLISHED:
            raise serializers.ValidationError("Esta atividade ainda não está disponível.")

        # 2. Validar se o aluno pertence à turma da atividade
        if student.class_group != activity.class_group:
            raise serializers.ValidationError("Você não pertence à turma desta atividade.")

        # 3. Validar se o prazo expirou
        if activity.due_date < timezone.now():
            raise serializers.ValidationError("O prazo para esta atividade já expirou.")

        return data


class SubmissionReadSerializer(serializers.ModelSerializer):
    """
    Serializer para leitura detalhada de respostas (inclui dados do estudante).
    """
    student = UserSimpleSerializer(read_only=True)

    class Meta:
        model = Submission
        fields = ('id', 'activity', 'student', 'content', 'score', 'feedback', 'created_at', 'updated_at')


class GradeSerializer(serializers.ModelSerializer):
    """
    Serializer para correção de atividades pelo professor.
    """
    class Meta:
        model = Submission
        fields = ('score', 'feedback')

    def validate_score(self, value):
        if value < 0 or value > 10:
            raise serializers.ValidationError("A nota deve estar entre 0 e 10.")
        return value

    def validate(self, data):
        if 'score' not in data or data['score'] is None:
            raise serializers.ValidationError({"score": "A nota é obrigatória na correção."})
        return data


class SubmissionUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer dinâmico para edição de respostas (PATCH).
    Diferencia campos permitidos para Aluno vs Professor.
    """
    class Meta:
        model = Submission
        fields = ('content', 'score', 'feedback')

    def validate(self, data):
        user = self.context['request'].user
        submission = self.instance
        activity = submission.activity

        if user.role == 'STUDENT':
            # Aluno só pode editar o conteúdo e se o prazo não expirou
            if activity.due_date < timezone.now():
                raise serializers.ValidationError("O prazo para edição desta resposta já expirou.")
            # Bloqueia alteração manual de nota pelo aluno
            if 'score' in data or 'feedback' in data:
                 raise serializers.ValidationError("Alunos não podem alterar nota ou feedback.")
            
        elif user.role == 'TEACHER':
            # Professor só pode editar nota e feedback
            if 'content' in data:
                raise serializers.ValidationError("Professores não podem alterar o conteúdo da resposta do aluno.")
            if 'score' in data and (data['score'] < 0 or data['score'] > 10):
                raise serializers.ValidationError("A nota deve estar entre 0 e 10.")

        return data


class ActivityMiniSerializer(serializers.ModelSerializer):
    """
    Serializer minimalista para aninhamento em listas.
    """
    class Meta:
        model = Activity
        fields = ('id', 'title', 'max_score')


class SubmissionStudentSerializer(serializers.ModelSerializer):
    """
    Serializer para o aluno ver suas próprias respostas (inclui dados da atividade).
    """
    activity = ActivityMiniSerializer(read_only=True)

    class Meta:
        model = Submission
        fields = ('id', 'activity', 'content', 'score', 'feedback', 'created_at', 'updated_at')

