import React, { useEffect, useState } from "react";

import { API_BASE } from "../config/apiBase";

// Helper function to manage recently viewed books
function addToRecentlyViewed(book) {
  const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  // Remove if already exists
  const filtered = recentlyViewed.filter(b => b.id !== book.id);
  // Add to beginning
  filtered.unshift({
    id: book.id,
    title: book.title,
    author: book.author,
    category: book.category,
    thumbnail: book.thumbnail,
    viewedAt: new Date().toISOString()
  });
  // Keep only last 10
  const limited = filtered.slice(0, 10);
  localStorage.setItem('recentlyViewed', JSON.stringify(limited));
}

import { RatingSummary } from '../Components/Rating.jsx';

function Library({ onOpenBook }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState(new Set());
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBooks() {
      try {
      const res = await fetch(`${API_BASE}/api/books`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;

        // make file URLs absolute so they point to the backend static route
        const mapped = (data || []).map((b) => ({
          ...b,
          file: b.file ? `${API_BASE}${b.file}` : b.file,
          thumbnail: b.thumbnail ? `${API_BASE}${b.thumbnail}` : null
        }));
        setBooks(mapped);
      } catch (err) {
        console.error('Failed to load books', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBooks();

    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('bookFavorites') || '[]');
    setFavorites(new Set(savedFavorites));

    // Get user role
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (e) {
        console.error('Failed to parse token', e);
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // Toggle favorite status
  const toggleFavorite = (bookId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(bookId)) {
      newFavorites.delete(bookId);
    } else {
      newFavorites.add(bookId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('bookFavorites', JSON.stringify([...newFavorites]));
  };

  // Bulk operations
  const toggleBookSelection = (bookId) => {
    const newSelected = new Set(selectedBooks);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedBooks(newSelected);
  };

  const selectAllVisible = () => {
    const newSelected = new Set(selectedBooks);
    paginatedBooks.forEach(book => newSelected.add(book.id));
    setSelectedBooks(newSelected);
  };

  const clearSelection = () => {
    setSelectedBooks(new Set());
  };

  const bulkFavorite = async (favorite) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${BACKEND_BASE}/api/books/bulk-favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookIds: [...selectedBooks],
          favorite
        })
      });

      if (res.ok) {
        const newFavorites = new Set(favorites);
        selectedBooks.forEach(bookId => {
          if (favorite) {
            newFavorites.add(bookId);
          } else {
            newFavorites.delete(bookId);
          }
        });
        setFavorites(newFavorites);
        localStorage.setItem('bookFavorites', JSON.stringify([...newFavorites]));
        clearSelection();
        alert(`${favorite ? 'Added' : 'Removed'} ${selectedBooks.size} books from favorites`);
      }
    } catch (err) {
      console.error('Bulk favorite failed', err);
      alert('Failed to update favorites');
    }
  };

  const bulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedBooks.size} books? This action cannot be undone.`)) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${BACKEND_BASE}/api/books/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookIds: [...selectedBooks]
        })
      });

      if (res.ok) {
        // Remove deleted books from local state
        setBooks(prev => prev.filter(book => !selectedBooks.has(book.id)));
        clearSelection();
        alert(`Deleted ${selectedBooks.size} books successfully`);
      }
    } catch (err) {
      console.error('Bulk delete failed', err);
      alert('Failed to delete books');
    }
  };

  // Filter books based on search term, category, and favorites
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (book.category && book.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || favorites.has(book.id);

    return matchesSearch && matchesCategory && matchesFavorites;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, showFavoritesOnly]);

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(books.map(book => book.category).filter(Boolean))];

  if (loading) return <p>Loading books…</p>;

  return (
    <section className="min-h-screen md:ml-64" aria-label="Library books">
      <h1 className="text-2xl font-bold mb-6">Library</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="text-sm font-medium">Category:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            className="rounded focus:ring-[#1F3D2B]"
          />
          <span className="text-sm font-medium">Favorites only</span>
        </label>

        {/* Bulk Operations Toggle - Only for authenticated users */}
        {userRole && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={bulkMode}
              onChange={(e) => {
                setBulkMode(e.target.checked);
                if (!e.target.checked) clearSelection();
              }}
              className="rounded focus:ring-[#1F3D2B]"
            />
            <span className="text-sm font-medium">Bulk Mode</span>
          </label>
        )}
      </div>

      {/* Bulk Operations Bar */}
      {bulkMode && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-blue-800">
              {selectedBooks.size} book{selectedBooks.size !== 1 ? 's' : ''} selected
            </span>

            <button
              onClick={selectAllVisible}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Select All Visible
            </button>

            <button
              onClick={clearSelection}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Clear Selection
            </button>

            {selectedBooks.size > 0 && (
              <>
                <button
                  onClick={() => bulkFavorite(true)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Add to Favorites
                </button>

                <button
                  onClick={() => bulkFavorite(false)}
                  className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  Remove from Favorites
                </button>

                {(userRole === 'Admin' || userRole === 'SuperAdmin') && (
                  <button
                    onClick={bulkDelete}
                    className="px-3 py-1 text-sm bg-red-800 text-white rounded hover:bg-red-900"
                  >
                    Delete Selected
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search books by title, author, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paginatedBooks.map((book) => (
          <div
            key={book.id}
            className={`relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 ${book.thumbnail ? 'h-96' : 'bg-white p-5'}`}
            style={book.thumbnail ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.18)), url(${book.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            } : undefined}
          >
            {/* Bulk Selection Checkbox */}
            {bulkMode && (
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={selectedBooks.has(book.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleBookSelection(book.id);
                  }}
                  className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(book.id);
              }}
              className={`absolute top-3 right-3 z-10 p-2 rounded-full ${
                favorites.has(book.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              } transition-colors`}
              aria-label={favorites.has(book.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg
                className="w-5 h-5"
                fill={favorites.has(book.id) ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            <div className="absolute inset-0 bg-black/20" />
            <div className="relative flex h-full flex-col justify-end p-5">
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-4 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8)' }}>{book.title}</h2>
                <p className="text-sm text-white font-bold mt-2">{book.author}</p>

                {/* Rating Summary */}
                <div className="mt-2">
                  <RatingSummary bookId={book.id} />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem('token');
                        await fetch(`${BACKEND_BASE}/api/books/${book.id}/view`, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {} });
                      } catch (e) { /* ignore */ }
                      addToRecentlyViewed(book);
                      onOpenBook(book);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#1F3D2B] text-white focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
                    aria-label={`Read ${book.title}`}
                  >
                    Read
                  </button>

                  <a
                    href={book.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
                    aria-label={`Open ${book.title} in a new tab`}
                  >
                    Open
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({filteredBooks.length} books)
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default Library;
