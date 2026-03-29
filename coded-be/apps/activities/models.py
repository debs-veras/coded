from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class ActivityQuerySet(models.QuerySet):
    def delete(self):
        return super().update(is_active=False)

    def active(self):
        return self.filter(is_active=True)


class ActivityManager(models.Manager):
    def get_queryset(self):
        return ActivityQuerySet(self.model, using=self._db).active()


class Activity(models.Model):
    class StatusChoice(models.TextChoices):
        DRAFT = 'DRAFT', 'Rascunho'
        PUBLISHED = 'PUBLISHED', 'Publicada'

    title = models.CharField(max_length=200, verbose_name="Título")
    description = models.TextField(verbose_name="Descrição")
    due_date = models.DateTimeField(verbose_name="Data de Entrega")
    
    class_group = models.ForeignKey(
        'classes.ClassGroup',
        on_delete=models.CASCADE,
        related_name='activities',
        verbose_name="Turma"
    )
    
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        limit_choices_to={'role': 'TEACHER'},
        related_name='created_activities',
        verbose_name="Professor"
    )

    max_score = models.DecimalField(
        max_digits=4, 
        decimal_places=2, 
        default=10.0,
        verbose_name="Nota Máxima"
    )

    status = models.CharField(
        max_length=20,
        choices=StatusChoice.choices,
        default=StatusChoice.PUBLISHED,
        verbose_name="Status"
    )

    is_active = models.BooleanField(default=True, verbose_name="Ativo")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ActivityManager()
    all_objects = models.Manager()

    class Meta:
        verbose_name = "Atividade"
        verbose_name_plural = "Atividades"
        ordering = ['-due_date']

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()


class SubmissionQuerySet(models.QuerySet):
    def delete(self):
        return super().update(is_active=False)

    def active(self):
        return self.filter(is_active=True)


class SubmissionManager(models.Manager):
    def get_queryset(self):
        return SubmissionQuerySet(self.model, using=self._db).active()


class Submission(models.Model):
    activity = models.ForeignKey(
        Activity,
        on_delete=models.CASCADE,
        related_name='submissions',
        verbose_name="Atividade"
    )
    
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'STUDENT'},
        related_name='submissions',
        verbose_name="Estudante"
    )

    content = models.TextField(verbose_name="Conteúdo da Resposta")
    
    score = models.DecimalField(
        max_digits=4, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        verbose_name="Nota"
    )
    
    feedback = models.TextField(blank=True, null=True, verbose_name="Feedback")
    
    is_active = models.BooleanField(default=True, verbose_name="Ativo")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SubmissionManager()
    all_objects = models.Manager()

    class Meta:
        verbose_name = "Resposta"
        verbose_name_plural = "Respostas"
        unique_together = ('activity', 'student')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.name} - {self.activity.title}"

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()
