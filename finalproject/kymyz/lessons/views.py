from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Lesson
from .serializers import LessonSerializer


class LessonListView(generics.ListAPIView):
    queryset = Lesson.objects.prefetch_related('scenes__audio_files', 'scenes__images', 'scenes__videos')
    serializer_class = LessonSerializer


class LessonDetailView(generics.RetrieveAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer






