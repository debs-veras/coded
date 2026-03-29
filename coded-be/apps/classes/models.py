from django.db import models
from django.conf import settings

class ClassGroupQuerySet(models.QuerySet):
    def delete(self):
        return super().update(is_active=False)

    def active(self):
        return self.filter(is_active=True)


class ClassGroupManager(models.Manager):
    def get_queryset(self):
        return ClassGroupQuerySet(self.model, using=self._db).active()


class ClassGroup(models.Model):
    name = models.CharField(max_length=100, verbose_name="Class Name")
    description = models.TextField(blank=True, null=True, verbose_name="Description")
    
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        limit_choices_to={'role': 'TEACHER'},
        related_name='taught_classes',
        verbose_name="Teacher"
    )

    is_active = models.BooleanField(default=True, verbose_name="Ativo")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")

    objects = ClassGroupManager()
    all_objects = models.Manager()

    class Meta:
        verbose_name = "Class Group"
        verbose_name_plural = "Class Groups"
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()
