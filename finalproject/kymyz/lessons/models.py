from django.db import models
from django.core.validators import FileExtensionValidator


class Lesson(models.Model):
    language = models.CharField(max_length=50, verbose_name='language', help_text='например, английский или испанский', null=True)
    title = models.CharField(max_length=255, verbose_name='название урока', help_text='основное название урока', null=True)
    difficulty = models.CharField(max_length=50, choices=[
    ('beginner', 'Начинающий'),
    ('intermediate', 'Средний'),
    ('advanced', 'Продвинутый')
    ], verbose_name='Уровень сложности', default='beginner', null=True, help_text='Уровень сложности урока')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    def __str__(self):
        return f"{self.title} ({self.language})"
    
    class Meta:
        verbose_name = 'Урок'
        verbose_name_plural =  'Уроки'
        ordering = ['-created_at']

class LessonScene(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='scenes', verbose_name='Урок')
    order = models.PositiveIntegerField(verbose_name='Порядок сцены', help_text='Порядок сцены в уроке')
    title = models.CharField(max_length=255, verbose_name='Загаловок сцены', )
    content = models.TextField(verbose_name='Контент сцены')

    def __str__(self):
        return f"{self.lesson.title} - Сцена {self.order}: {self.title}"
    
    class Meta:
        verbose_name = 'Сцена урока'
        verbose_name_plural = 'Сцены урока'
        ordering = ['lesson', 'order']
        unique_together = ['lesson', 'order']

class Audio(models.Model):
    scene = models.ForeignKey(LessonScene, on_delete=models.CASCADE, related_name='audio_files', verbose_name='Сцена', null=True)
    audio = models.FileField(upload_to='audio/', verbose_name='Аудиофайл', null=True, blank=True)

    def __str__(self):
        return self.audio.name

    class Meta:
        verbose_name = "Аудио"
        verbose_name_plural = "Аудиофайлы"
        ordering = ['-id']


class Image(models.Model):
    scene = models.ForeignKey(LessonScene, on_delete=models.CASCADE, related_name='images', verbose_name='Сцена', null=True)
    image = models.FileField(upload_to='images/', verbose_name='Изображение', null=True, blank=True)

    def __str__(self):
        return self.image.name

    class Meta:
        verbose_name = "Изображение"
        verbose_name_plural = "Изображения"
        ordering = ['-id']


class Video(models.Model):
    scene = models.ForeignKey(LessonScene, on_delete=models.CASCADE, related_name='videos', verbose_name='Сцена', null=True)
    video = models.FileField(upload_to='videos/', verbose_name='Видеофайл', null=True, blank=True)

    def __str__(self):
        return self.video.name

    class Meta:
        verbose_name = "Видео"
        verbose_name_plural = "Видеофайлы"
        ordering = ['-id']