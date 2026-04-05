import React, { useState, useEffect } from 'react';
import { StarRating } from '../Components/Rating.jsx';

const BACKEND_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

function Profile({ user, onBack }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not authenticated');
          return;
        }

        const res = await fetch(`${BACKEND_BASE}/api/users/${user.id}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch profile: ${res.status}`);
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F3D2B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-[#1F3D2B] text-white rounded-lg hover:bg-[#2A4A3A]"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const { user: profileUser, statistics, ratings } = profile;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1F3D2B] text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold">My Profile</h1>
          <div></div> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#1F3D2B] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profileUser.name?.charAt(0)?.toUpperCase() || profileUser.serviceID?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profileUser.name || profileUser.serviceID}</h2>
              <p className="text-gray-600">{profileUser.serviceID}</p>
              <p className="text-sm text-gray-500 capitalize">{profileUser.role}</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-[#1F3D2B] mb-2">{statistics.booksRated}</div>
            <div className="text-gray-600">Books Rated</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-[#C5A64D] mb-2">{statistics.averageRating}</div>
            <div className="text-gray-600">Average Rating</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-[#1F3D2B] mb-2">{statistics.reviewsWritten}</div>
            <div className="text-gray-600">Reviews Written</div>
          </div>
        </div>

        {/* Reading History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-6">My Reviews & Ratings</h3>

          {ratings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't rated any books yet.</p>
              <p className="mt-2">Start reading and leave your first review!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {ratings.map((rating) => (
                <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-gray-900">{rating.book.title}</h4>
                      <p className="text-gray-600">by {rating.book.author}</p>
                      {rating.book.category && (
                        <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {rating.book.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={rating.rating} readonly />
                      <span className="text-sm text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {rating.review && (
                    <div className="mt-3">
                      <p className="text-gray-700 whitespace-pre-wrap">{rating.review}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Profile;