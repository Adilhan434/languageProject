from django.contrib import admin

# Register your models here.

from .models import Audio, Image, Video, LessonScene, Lesson

admin.site.register(Audio)
admin.site.register(Image)
admin.site.register(Video)
admin.site.register(LessonScene)
admin.site.register(Lesson)
