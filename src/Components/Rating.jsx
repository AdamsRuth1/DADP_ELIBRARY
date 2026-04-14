import React, { useState, useEffect } from 'react';

const BACKEND_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

function StarRating({ rating, onRatingChange, readonly = false, size = 'md' }) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const starClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={`focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <svg
            className={`${starClass} ${
              star <= (hoverRating || rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function RatingSummary({ bookId, showDistribution = false }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch(`${BACKEND_BASE}/api/books/${bookId}/rating-summary`);
        if (res.ok) {
          const data = await res.json();
          setSummary(data);
        }
      } catch (err) {
        console.error('Failed to fetch rating summary', err);
      } finally {
        setLoading(false);
      }
    }

    if (bookId) fetchSummary();
  }, [bookId]);

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;
  if (!summary || summary.totalRatings === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <StarRating rating={Math.round(summary.averageRating)} readonly size="sm" />
      <span className="text-gray-600">
        {summary.averageRating} ({summary.totalRatings} review{summary.totalRatings !== 1 ? 's' : ''})
      </span>
      {showDistribution && (
        <div className="ml-4 text-xs text-gray-500">
          {[5, 4, 3, 2, 1].map(stars => (
            <div key={stars} className="flex items-center gap-1">
              <span>{stars}★</span>
              <div className="w-16 bg-gray-200 rounded-full h-1">
                <div
                  className="bg-yellow-400 h-1 rounded-full"
                  style={{ width: `${summary.totalRatings > 0 ? (summary.distribution[stars] / summary.totalRatings) * 100 : 0}%` }}
                />
              </div>
              <span>{summary.distribution[stars]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RatingForm({ bookId, onRatingSubmit, initialRating = null, initialReview = '' }) {
  const [rating, setRating] = useState(initialRating?.rating || 0);
  const [review, setReview] = useState(initialRating?.review || initialReview);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    try {
      const success = await onRatingSubmit({ rating, review: review.trim() });
      if (success) {
        // Reset form if it's a new rating
        if (!initialRating) {
          setRating(0);
          setReview('');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Your Rating</label>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Review (Optional)</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your thoughts about this book..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A64D] focus:border-transparent resize-none"
          rows={4}
          maxLength={1000}
        />
        <div className="text-xs text-gray-500 mt-1">{review.length}/1000</div>
      </div>

      <button
        type="submit"
        disabled={rating === 0 || submitting}
        className="px-4 py-2 bg-[#1F3D2B] text-white rounded-lg hover:bg-[#2A4A3A] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
      >
        {submitting ? 'Submitting...' : initialRating ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
}

function ReviewList({ bookId, currentUserId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`${BACKEND_BASE}/api/books/${bookId}/ratings`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      } finally {
        setLoading(false);
      }
    }

    if (bookId) fetchReviews();
  }, [bookId]);

  if (loading) return <div className="text-center py-4">Loading reviews...</div>;
  if (reviews.length === 0) return <div className="text-center py-4 text-gray-500">No reviews yet. Be the first to review this book!</div>;

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reviews ({reviews.length})</h3>
        {reviews.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[#C5A64D] hover:text-[#B59542] text-sm font-medium"
          >
            {showAll ? 'Show Less' : `Show All (${reviews.length})`}
          </button>
        )}
      </div>

      {displayedReviews.map((review) => (
        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{review.userName || review.serviceID}</span>
              <StarRating rating={review.rating} readonly size="sm" />
            </div>
            <span className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>

          {review.review && (
            <p className="text-gray-700 mt-2 whitespace-pre-wrap">{review.review}</p>
          )}

          {currentUserId === review.userId && (
            <div className="mt-2 text-xs text-gray-500">
              Your review
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export { StarRating, RatingSummary, RatingForm, ReviewList };