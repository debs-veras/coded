from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ClassGroup

User = get_user_model()

class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email')

class ClassGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassGroup
        fields = ('id', 'name', 'description', 'teacher', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_teacher(self, value):
        if value and value.role != User.RoleChoice.TEACHER:
            raise serializers.ValidationError("The selected user must have a Teacher role.")
        return value

class ClassGroupDetailSerializer(serializers.ModelSerializer):
    teacher = UserSimpleSerializer(read_only=True)
    students = UserSimpleSerializer(many=True, read_only=True)
    total_students = serializers.SerializerMethodField()

    class Meta:
        model = ClassGroup
        fields = ('id', 'name', 'description', 'teacher', 'students', 'total_students', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_total_students(self, obj):
        return obj.students.count()
