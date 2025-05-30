from rest_framework import serializers
from .models import Audio, Image, Video, LessonScene, Lesson


class AudioSerializer(serializers.ModelSerializer):

    audio = serializers.FileField()

    class Meta:
        model = Audio
        fields = [ 'audio']


class ImageSerializer(serializers.ModelSerializer):

    image = serializers.FileField()

    class Meta:
        model = Image
        fields = ['image']


class VideoSerializer(serializers.ModelSerializer):

    video = serializers.FileField()

    class Meta:
        model = Video
        fields = [ 'video']


class LessonSceneSerializer(serializers.ModelSerializer):

    audio_files = AudioSerializer(many=True, read_only=True)
    images = ImageSerializer(many=True, read_only=True)
    videos = VideoSerializer(many=True, read_only=True)

    class Meta:
        model = LessonScene
        fields = ['order', 'title', 'content', 'audio_files', 'images', 'videos']


class LessonSerializer(serializers.ModelSerializer):
   scenes = LessonSceneSerializer(many=True, read_only=True)
   
   class Meta:
        model = Lesson
        fields = [
            'id',
            'title',
            'language',
            'difficulty',
            'created_at',
            'updated_at',
            'scenes'
        ]
