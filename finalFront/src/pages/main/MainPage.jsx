import React, { useState, useEffect } from 'react';

const MainPage = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  // Сохраняем текущую сцену в localStorage
  const [activeScene, setActiveScene] = useState(() => {
    const saved = localStorage.getItem('activeScene');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/lessons/');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setLessons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  useEffect(() => {
    if (activeScene) {
      localStorage.setItem('activeScene', JSON.stringify(activeScene));
    } else {
      localStorage.removeItem('activeScene');
    }
  }, [activeScene]);

  const languages = ['All', ...new Set(lessons.map(lesson => lesson.language))];
  const levels = ['All', ...new Set(lessons.map(lesson => lesson.difficulty))];

  const filteredLessons = lessons.filter(lesson => {
    const languageMatch = selectedLanguage === 'All' || lesson.language === selectedLanguage;
    const levelMatch = selectedLevel === 'All' || lesson.difficulty === selectedLevel;
    return languageMatch && levelMatch;
  });

  const openLessonScene = (lessonId, sceneIndex = 0) => {
    setActiveScene({ lessonId, sceneIndex });
  };

  const closeSceneView = () => {
    setActiveScene(null);
  };

  const nextScene = () => {
    const lesson = lessons.find(l => l.id === activeScene.lessonId);
    if (lesson && activeScene.sceneIndex < lesson.scenes.length - 1) {
      setActiveScene({ ...activeScene, sceneIndex: activeScene.sceneIndex + 1 });
    }
  };

  const prevScene = () => {
    if (activeScene.sceneIndex > 0) {
      setActiveScene({ ...activeScene, sceneIndex: activeScene.sceneIndex - 1 });
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-100 text-red-700 rounded-lg max-w-md mx-auto mt-8">
      Error: {error}
    </div>
  );

  // === FULLSCREEN SCENE VIEW ===
  if (activeScene) {
    const lesson = lessons.find(l => l.id === activeScene.lessonId);
    const scene = lesson?.scenes[activeScene.sceneIndex];

    if (!scene) return null;
      return (
        <div className="min-h-screen bg-white text-gray-800 px-4 py-8 flex flex-col items-center">
          <div className="w-full max-w-3xl space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {lesson.title} — {scene.title}
              </h1>
              <button
                onClick={closeSceneView}
                className="text-sm text-gray-500 hover:text-red-600 transition"
              >
                Закрыть ✕
              </button>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <p>{scene.content}</p>
            </div>

            {/* Audio */}
            {scene.audio_files.length > 0 && (
              <div>
                <h3 className="text-lg font-medium border-b pb-1 mb-2">🎧 Аудио</h3>
                <div className="space-y-2">
                  {scene.audio_files.map((audio, i) => (
                    <audio key={i} controls className="w-full rounded-md border shadow-sm">
                      <source src={audio.audio} type="audio/mp3" />
                    </audio>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            {scene.images.length > 0 && (
              <div>
                <h3 className="text-lg font-medium border-b pb-1 mb-2">🖼 Изображения</h3>
                <div className="grid grid-cols-2 gap-4">
                  {scene.images.map((image, i) => (
                    <img
                      key={i}
                      src={image.image}
                      alt={`Image ${i + 1}`}
                      className="rounded-xl shadow-sm border"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {scene.videos.length > 0 && (
              <div>
                <h3 className="text-lg font-medium border-b pb-1 mb-2">🎬 Видео</h3>
                <div className="space-y-3">
                  {scene.videos.map((video, i) => (
                    <video
                      key={i}
                      controls
                      className="w-full rounded-xl border shadow-sm"
                    >
                      <source src={video.video} type="video/mp4" />
                    </video>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t mt-8">
              <button
                onClick={prevScene}
                disabled={activeScene.sceneIndex === 0}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-40"
              >
                ← Назад
              </button>
              <button
                onClick={nextScene}
                disabled={activeScene.sceneIndex >= lesson.scenes.length - 1}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm disabled:opacity-40"
              >
                Вперёд →
              </button>
            </div>
          </div>
        </div>
  );}


  // === DEFAULT LESSON LIST ===
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Language Lessons</h1>
          <p className="mt-2">Practice and improve your language skills</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="space-y-4">
          {filteredLessons.length > 0 ? (
            filteredLessons.map(lesson => (
              <div key={lesson.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => openLessonScene(lesson.id, 0)}
                >
                  <h2 className="text-xl font-semibold text-gray-800">
                    {lesson.title} <span className="text-blue-600 ml-2">({lesson.language})</span>
                  </h2>
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded-full">{lesson.difficulty}</span>
                    <span>Created: {new Date(lesson.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No lessons found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
