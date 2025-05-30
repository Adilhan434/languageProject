from django.urls import path, include

from .views import LessonListView, LessonDetailView



urlpatterns = [
    path('api/lessons/', LessonListView.as_view(), name='lesson-list'),
    path('api/lessons/<int:pk>/', LessonDetailView.as_view(), name='lesson-list'),
]
