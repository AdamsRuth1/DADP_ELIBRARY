import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../Components/sidebar";
import Library from "../pages/library";
import Reader from "../pages/reader";
import UsersPage from "./users";
import Profile from "./profile";

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json = decodeURIComponent(atob(payload).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(json);
  } catch (e) { return null; }
}

function Dashboard() {
  const [activeItem, setActiveItem] = useState("Library");
  const [selectedBook, setSelectedBook] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [readingStats, setReadingStats] = useState({
    totalTime: 0,
    booksCompleted: 0,
    currentStreak: 0,
    weeklyGoal: 7, // hours per week
    monthlyGoal: 30 // hours per month
  });
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const jwt = token ? parseJwt(token) : null;
  const role = jwt ? jwt.role : null;

  // Refs for auto-scrolling
  const recentlyViewedRef = useRef(null);
  const favoritesRef = useRef(null);

  useEffect(() => {
    // Load recently viewed books from localStorage
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewed(viewed);

    // Load favorite books from localStorage
    const favoriteIds = JSON.parse(localStorage.getItem('bookFavorites') || '[]');
    if (favoriteIds.length > 0) {
      // Fetch book details for favorites
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/books`)
        .then(res => res.json())
        .then(books => {
          const favoriteBooks = books.filter(book => favoriteIds.includes(book.id));
          setFavorites(favoriteBooks);
        })
        .catch(err => console.error('Failed to load favorites:', err));
    }

    // Load and calculate reading statistics
    loadReadingStats();
  }, []);

  // Load analytics data for admin users
  useEffect(() => {
    if (role === 'Admin' || role === 'SuperAdmin') {
      fetchAnalytics();
    }
  }, [role]);

  // Auto-scroll for Recently Viewed Books
  useEffect(() => {
    if (!recentlyViewedRef.current || recentlyViewed.length === 0) return;

    const container = recentlyViewedRef.current;
    let scrollInterval;
    let isPaused = false;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (isPaused) return;

        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;

        // If we've scrolled to the end of the duplicated content, reset to beginning
        if (scrollLeft >= scrollWidth / 2 - clientWidth) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += 1; // Slow, smooth scroll
        }
      }, 50); // Adjust speed here (lower = faster)
    };

    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    startAutoScroll();

    return () => {
      clearInterval(scrollInterval);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [recentlyViewed]);

  // Auto-scroll for Favorite Books
  useEffect(() => {
    if (!favoritesRef.current || favorites.length === 0) return;

    const container = favoritesRef.current;
    let scrollInterval;
    let isPaused = false;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (isPaused) return;

        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;

        // If we've scrolled to the end of the duplicated content, reset to beginning
        if (scrollLeft >= scrollWidth / 2 - clientWidth) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += 1; // Slow, smooth scroll
        }
      }, 50); // Adjust speed here (lower = faster)
    };

    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    startAutoScroll();

    return () => {
      clearInterval(scrollInterval);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [favorites]);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const loadReadingStats = () => {
    const stats = JSON.parse(localStorage.getItem('readingStats') || '{}');
    let totalTime = 0;
    let booksCompleted = 0;

    // Calculate from all book progress
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('book_progress_')) {
        const progress = JSON.parse(localStorage.getItem(key) || '{}');
        if (progress.timeSpent) totalTime += progress.timeSpent;
        if (progress.percentage >= 100) booksCompleted++;
      }
    });

    // Calculate weekly/monthly progress
    const now = new Date();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let weeklyTime = 0;
    let monthlyTime = 0;

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('book_progress_')) {
        const progress = JSON.parse(localStorage.getItem(key) || '{}');
        if (progress.lastRead) {
          const lastRead = new Date(progress.lastRead);
          if (lastRead >= weekStart) weeklyTime += progress.timeSpent || 0;
          if (lastRead >= monthStart) monthlyTime += progress.timeSpent || 0;
        }
      }
    });

    setReadingStats({
      totalTime: stats.totalTime || totalTime,
      booksCompleted: stats.booksCompleted || booksCompleted,
      weeklyTime,
      monthlyTime,
      weeklyGoal: stats.weeklyGoal || 7,
      monthlyGoal: stats.monthlyGoal || 30,
      currentStreak: stats.currentStreak || 0
    });
  };

  const handleOpenBook = (book) => {
    setSelectedBook(book);
    // Update recently viewed when opening from dashboard
    const updated = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const filtered = updated.filter(b => b.id !== book.id);
    filtered.unshift({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      thumbnail: book.thumbnail,
      viewedAt: new Date().toISOString()
    });
    const limited = filtered.slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(limited));
    setRecentlyViewed(limited);
  };

  if (selectedBook) {
    return (
      <Reader
        selectedBook={selectedBook}
        onBack={() => setSelectedBook(null)}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 ">
      <Sidebar activeItem={activeItem} onNavigate={setActiveItem} role={role} />

      <main className="flex-1 p-6 overflow-x-auto">
        {activeItem === "Library" && (
          <Library onOpenBook={setSelectedBook} />
        )}

        {activeItem === "Users" && (
          <UsersPage />
        )}

        {activeItem === "Profile" && (
          <Profile user={jwt} onBack={() => setActiveItem("Dashboard")} />
        )}

        {activeItem === "Dashboard" && (
          <div className="ml-64 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <p className="mt-2 text-gray-600 mb-8">
              Welcome to the DADP eLibrary dashboard.
            </p>

            {/* Reading Statistics */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Reading Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">Total Reading Time</h3>
                  <p className="text-2xl font-bold text-[#1F3D2B]">
                    {Math.floor(readingStats.totalTime / 3600)}h {Math.floor((readingStats.totalTime % 3600) / 60)}m
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">Books Completed</h3>
                  <p className="text-2xl font-bold text-[#1F3D2B]">{readingStats.booksCompleted}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">This Week</h3>
                  <p className="text-2xl font-bold text-[#1F3D2B]">
                    {Math.floor(readingStats.weeklyTime / 3600)}h {Math.floor((readingStats.weeklyTime % 3600) / 60)}m
                  </p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#1F3D2B] h-2 rounded-full"
                      style={{ width: `${Math.min((readingStats.weeklyTime / 3600 / readingStats.weeklyGoal) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Goal: {readingStats.weeklyGoal}h</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">This Month</h3>
                  <p className="text-2xl font-bold text-[#1F3D2B]">
                    {Math.floor(readingStats.monthlyTime / 3600)}h {Math.floor((readingStats.monthlyTime % 3600) / 60)}m
                  </p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#1F3D2B] h-2 rounded-full"
                      style={{ width: `${Math.min((readingStats.monthlyTime / 3600 / readingStats.monthlyGoal) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Goal: {readingStats.monthlyGoal}h</p>
                </div>
              </div>
            </div>

            {/* Recently Viewed Books */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Recently Viewed Books</h2>
              {recentlyViewed.length === 0 ? (
                <p className="text-gray-500">No recently viewed books yet. Start reading to see them here!</p>
              ) : (
                <div className="relative overflow-hidden">
                  <div
                    ref={recentlyViewedRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
                    style={{
                      scrollBehavior: 'smooth',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    {/* Duplicate items for infinite scroll effect */}
                    {[...recentlyViewed, ...recentlyViewed].map((book, index) => (
                      <div
                        key={`${book.id}-${index}`}
                        className="flex-shrink-0 w-64 h-48 relative rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                        style={book.thumbnail ? {
                          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${book.thumbnail})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        } : undefined}
                        onClick={() => handleOpenBook(book)}
                      >
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative h-full flex flex-col justify-end p-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                            <p className="text-xs text-gray-600 mb-1">{book.author}</p>
                            <p className="text-xs text-gray-500">{book.category}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              Viewed {new Date(book.viewedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Favorite Books */}
            <div className="mb-8" overflow-x-scroll>
              <h2 className="text-xl font-semibold mb-4">Favorite Books</h2>
              {favorites.length === 0 ? (
                <p className="text-gray-500">No favorite books yet. Click the heart icon on books you love!</p>
              ) : (
                <div className="relative overflow-x-scroll">
                  <div
                    ref={favoritesRef}
                    className="flex gap-4 overflow-x-scroll scroll-smooth"
                    style={{
                      scrollBehavior: 'smooth',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    {/* Duplicate items for infinite scroll effect */}
                    {[...favorites, ...favorites].map((book, index) => (
                      <div
                        key={`${book.id}-${index}`}
                        className="flex-shrink-0 w-64 h-48 relative rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                        style={book.thumbnail ? {
                          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${book.thumbnail})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        } : undefined}
                        onClick={() => handleOpenBook(book)}
                      >
                        <div className="absolute top-3 right-3 z-10">
                          <svg
                            className="w-5 h-5 text-red-500"
                            fill="currentColor"
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
                        </div>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative h-full flex flex-col justify-end p-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                            <p className="text-xs text-gray-600 mb-1">{book.author}</p>
                            <p className="text-xs text-gray-500">{book.category}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Analytics Section */}
            {(role === 'Admin' || role === 'SuperAdmin') && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">System Analytics</h2>

                {analyticsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F3D2B] mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading analytics...</p>
                  </div>
                ) : analytics ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                      <h3 className="text-sm font-medium text-gray-500">Total Books</h3>
                      <p className="text-2xl font-bold text-[#1F3D2B]">{analytics.totalBooks}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                      <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                      <p className="text-2xl font-bold text-[#C5A64D]">{analytics.totalUsers}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                      <h3 className="text-sm font-medium text-gray-500">Total Ratings</h3>
                      <p className="text-2xl font-bold text-[#1F3D2B]">{analytics.totalRatings}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                      <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
                      <p className="text-2xl font-bold text-green-600">{analytics.averageRating}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <p className="text-gray-600 mb-4">Unable to load analytics data</p>
                    <button
                      onClick={fetchAnalytics}
                      className="px-4 py-2 bg-[#1F3D2B] text-white rounded-lg hover:bg-[#2A4A3A]"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {analytics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.recentActivities}</div>
                        <div className="text-gray-600">Activities (Last 30 days)</div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h3 className="text-lg font-semibold mb-4">System Health</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Books per User:</span>
                          <span className="font-medium">
                            {analytics.totalUsers > 0 ? (analytics.totalBooks / analytics.totalUsers).toFixed(1) : 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ratings per Book:</span>
                          <span className="font-medium">
                            {analytics.totalBooks > 0 ? (analytics.totalRatings / analytics.totalBooks).toFixed(1) : 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Activity Rate:</span>
                          <span className="font-medium">
                            {analytics.recentActivities > 0 ? `${(analytics.recentActivities / 30).toFixed(1)}/day` : '0/day'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
