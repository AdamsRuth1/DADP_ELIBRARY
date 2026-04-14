import React, { useState, useEffect } from "react";
import { RatingForm, ReviewList } from '../Components/Rating.jsx';
import AiLibrarianWidget from "../Components/AiLibrarianWidget";

import { API_BASE } from "../config/apiBase";

function Reader({ selectedBook, onBack }) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('serif');
  const [nightMode, setNightMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState("");

  const addBookmark = () => {
    try {
      const existing = JSON.parse(localStorage.getItem("bookBookmarks") || "[]");
      const arr = Array.isArray(existing) ? existing : [];
      const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const bm = {
        id,
        bookId: selectedBook.id,
        bookTitle: selectedBook.title,
        bookAuthor: selectedBook.author,
        progress: readingProgress,
        note: bookmarkNote.trim(),
        createdAt: new Date().toISOString(),
        bookSnapshot: selectedBook
      };
      const next = [bm, ...arr].slice(0, 500);
      localStorage.setItem("bookBookmarks", JSON.stringify(next));
      setBookmarkNote("");
      setShowBookmarkModal(false);
    } catch (e) {
      console.error("Failed to save bookmark", e);
      alert("Failed to save bookmark");
    }
  };

  // Load saved progress and settings when component mounts
  useEffect(() => {
    if (selectedBook) {
      const savedProgress = localStorage.getItem(`book_progress_${selectedBook.id}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setReadingProgress(progress.percentage || 0);
        setReadingTime(progress.timeSpent || 0);
      }

      // Load reading settings
      const settings = JSON.parse(localStorage.getItem('readingSettings') || '{}');
      setFontSize(settings.fontSize || 16);
      setFontFamily(settings.fontFamily || 'serif');
      setNightMode(settings.nightMode || false);
    }
  }, [selectedBook]);

  // Save settings when they change
  useEffect(() => {
    const settings = { fontSize, fontFamily, nightMode };
    localStorage.setItem('readingSettings', JSON.stringify(settings));
  }, [fontSize, fontFamily, nightMode]);

  // Save progress when it changes
  useEffect(() => {
    if (selectedBook) {
      const progressData = {
        percentage: readingProgress,
        timeSpent: readingTime,
        lastRead: new Date().toISOString(),
        bookId: selectedBook.id,
        bookTitle: selectedBook.title
      };
      localStorage.setItem(`book_progress_${selectedBook.id}`, JSON.stringify(progressData));
    }
  }, [readingProgress, readingTime, selectedBook]);

  // Load user's current rating for this book
  useEffect(() => {
    const loadUserRating = async () => {
      if (!selectedBook) return;

      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Parse JWT to get user ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.sub);

        const res = await fetch(`${API_BASE}/api/books/${selectedBook.id}/rating`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const rating = await res.json();
          setUserRating(rating);
        }
      } catch (err) {
        console.error('Failed to load user rating', err);
      }
    };

    loadUserRating();
  }, [selectedBook]);
  useEffect(() => {
    let interval;
    if (isReading) {
      interval = setInterval(() => {
        setReadingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReading]);

  const handleProgressChange = (e) => {
    const newProgress = parseInt(e.target.value);
    setReadingProgress(newProgress);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle rating submission
  const handleRatingSubmit = async (ratingData) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const res = await fetch(`${API_BASE}/api/books/${selectedBook.id}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(ratingData)
      });

      if (res.ok) {
        const result = await res.json();
        setUserRating({
          id: result.id,
          rating: result.rating,
          review: result.review,
          createdAt: new Date().toISOString()
        });
        setShowRatingModal(false);
        return true;
      }
    } catch (err) {
      console.error('Failed to submit rating', err);
    }
    return false;
  };

  if (!selectedBook) return null;

  return (
    <div className={`flex flex-col min-h-screen ${nightMode ? 'bg-gray-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`px-6 py-4 flex items-center justify-between ${nightMode ? 'bg-gray-800' : 'bg-[#1F3D2B] text-white'}`}>
        <button
          onClick={onBack}
          className={`rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C5A64D] ${nightMode ? 'bg-gray-700 text-white' : 'bg-white/10'}`}
          aria-label="Back to library"
        >
          Back
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowBookmarkModal(true)}
            className={`rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C5A64D] ${nightMode ? 'bg-gray-700 text-white' : 'bg-white/10'}`}
            aria-label="Bookmark this moment"
          >
            🔖 Bookmark
          </button>

          <button
            onClick={() => setShowRatingModal(true)}
            className={`rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C5A64D] ${nightMode ? 'bg-gray-700 text-white' : 'bg-white/10'}`}
            aria-label="Rate this book"
          >
            ⭐ Rate & Review
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C5A64D] ${nightMode ? 'bg-gray-700 text-white' : 'bg-white/10'}`}
            aria-label="Reading settings"
          >
            ⚙️ Settings
          </button>

          <div className="flex flex-col items-center">
            <h1 className="text-lg font-semibold">{selectedBook.title}</h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm text-green-100">
                Progress: {readingProgress}%
              </span>
              <span className="text-sm text-green-100">
                Time: {formatTime(readingTime)}
              </span>
            </div>
          </div>
        </div>

        <a
          href={selectedBook.file}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#C5A64D] ${nightMode ? 'bg-gray-700 text-white' : 'bg-white text-[#1F3D2B]'}`}
        >
          Open PDF
        </a>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`p-4 border-b ${nightMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Font Size:</label>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-20"
              />
              <span className="text-sm">{fontSize}px</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Font:</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className={`p-1 border rounded ${nightMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans Serif</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Night Mode:</label>
              <button
                onClick={() => setNightMode(!nightMode)}
                className={`px-3 py-1 rounded ${nightMode ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-white'}`}
              >
                {nightMode ? '☀️ Day' : '🌙 Night'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-4" aria-label="PDF reader">
        {/* Reading Controls */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Reading Progress</h2>
            <button
              onClick={() => setIsReading(!isReading)}
              className={`px-4 py-2 rounded-lg font-medium ${
                isReading
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isReading ? 'Pause Reading' : 'Start Reading'}
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">
                Reading Progress: {readingProgress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={readingProgress}
                onChange={handleProgressChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>Time spent reading: {formatTime(readingTime)}</span>
              <span>Last read: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <iframe
          src={selectedBook.file}
          title={selectedBook.title}
          className={`w-full h-[70vh] rounded-xl border border-gray-300 bg-white ${nightMode ? 'filter invert brightness-90' : ''}`}
          onLoad={() => setIsReading(true)}
        />
      </main>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${nightMode ? 'bg-gray-800 text-white' : ''}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Rate & Review: {selectedBook.title}</h2>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <RatingForm
                  bookId={selectedBook.id}
                  onRatingSubmit={handleRatingSubmit}
                  initialRating={userRating}
                />

                <div className="border-t pt-6">
                  <ReviewList bookId={selectedBook.id} currentUserId={currentUserId} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bookmark Modal */}
      {showBookmarkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg shadow-xl max-w-xl w-full ${nightMode ? 'bg-gray-800 text-white' : ''}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Bookmark: {selectedBook.title}</h2>
                <button
                  onClick={() => setShowBookmarkModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-900">
                Saved at <span className="font-semibold">{readingProgress}%</span> progress.
              </div>

              <label className="block mt-4 text-sm font-medium">
                Optional note
              </label>
              <textarea
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                rows={4}
                className={`mt-2 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C5A64D] ${nightMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                placeholder="Why is this part important?"
              />

              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowBookmarkModal(false)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
                >
                  Cancel
                </button>
                <button
                  onClick={addBookmark}
                  className="px-4 py-2 rounded-lg bg-[#1F3D2B] text-white hover:bg-[#2A4A3A] focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
                >
                  Save bookmark
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AiLibrarianWidget
        mode="reader"
        currentBook={selectedBook}
      />
    </div>
  );
}

export default Reader;
