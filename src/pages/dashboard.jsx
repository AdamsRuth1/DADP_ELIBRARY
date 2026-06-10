import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../Components/sidebar";
import Library from "../pages/library";
import Reader from "../pages/reader";
import UsersPage from "./users";
import Profile from "./profile";
import Bookmarks from "./bookmarks";
import AiLibrarianWidget from "../Components/AiLibrarianWidget";
import InstructorMaterials from "./instructorMaterials";
import LandingEditor from "./landingEditor";
import { API_BASE } from "../config/apiBase";
import useAuth from '../hooks/useAuth';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
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
  const auth = useAuth();
  const token = auth?.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  const jwt = auth?.user || (token ? parseJwt(token) : null);
  const role = jwt ? jwt.role : null;

  // Refs for auto-scrolling
  const recentlyViewedRef = useRef(null);
  const recentlyAddedRef = useRef(null);
  const favoritesRef = useRef(null);

  useEffect(() => {
    // Load recently viewed books from localStorage
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewed(viewed);

    // Load favorite books IDs from localStorage
    const favoriteIds = JSON.parse(localStorage.getItem('bookFavorites') || '[]');

    // Fetch all books for Recently Added (admin only) and Favorites
    fetch(`${API_BASE}/api/books`)
      .then(res => res.json())
      .then(books => {
        const fixUrl = (url) => {
          if (!url) return url;
          if (url.startsWith('http')) return url;
          return `${API_BASE}${url}`;
        };
        const mapped = books.map(b => ({
          ...b,
          thumbnail: fixUrl(b.thumbnail),
          file: fixUrl(b.file)
        }));

        // Only populate Recently Added for Admin / SuperAdmin
        const currentToken = auth?.token || localStorage.getItem('token');
        const currentJwt = currentToken ? parseJwt(currentToken) : null;
        const currentRole = currentJwt ? currentJwt.role : null;
        if (currentRole === 'Admin' || currentRole === 'SuperAdmin') {
          setRecentlyAdded(mapped.slice(0, 12));
        }

        // Filter Favorites (available to all users)
        const favoriteBooks = mapped.filter(book => favoriteIds.includes(book.id));
        setFavorites(favoriteBooks);
      })
      .catch(err => console.error('Failed to load books:', err));

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

  // Auto-scroll for Recently Added Books
  useEffect(() => {
    if (!recentlyAddedRef.current || recentlyAdded.length === 0) return;
    const container = recentlyAddedRef.current;
    let scrollInterval;
    let isPaused = false;
    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (isPaused) return;
        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        if (scrollLeft >= scrollWidth / 2 - clientWidth) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += 1;
        }
      }, 50);
    };
    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    startAutoScroll();
    return () => {
      clearInterval(scrollInterval);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [recentlyAdded]);

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
        if (scrollLeft >= scrollWidth / 2 - clientWidth) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += 1;
        }
      }, 60); // Slightly slower
    };
    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };
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
      const token = auth?.token || localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/analytics`, {
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
    <div className="flex min-h-screen bg-[#FDFDFD] text-slate-900 relative">
      <Sidebar
        activeItem={activeItem}
        onNavigate={setActiveItem}
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 md:hidden bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="px-3 py-2 rounded-lg bg-[#1F3D2B] text-white focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
            aria-label="Open menu"
          >
            ☰
          </button>
          <div className="text-sm font-semibold text-gray-900">DADP eLibrary</div>
          <div className="w-10" />
        </div>
      </div>

      <main className="flex-1 overflow-x-auto px-4 py-4 pt-16 md:ml-64 md:px-6 md:pl-[15px] md:pt-6 pb-24 md:pb-6">
        {activeItem === "Library" && (
          <Library onOpenBook={setSelectedBook} />
        )}

        {activeItem === "Users" && (
          <UsersPage />
        )}

        {activeItem === "Profile" && (
          <Profile user={jwt} onBack={() => setActiveItem("Dashboard")} />
        )}

        {activeItem === "Bookmarks" && (
          <Bookmarks onOpenBook={setSelectedBook} />
        )}

        {activeItem === "Academics" && (
          <InstructorMaterials />
        )}

        {activeItem === "Landing Editor" && (
          <LandingEditor />
        )}

        {activeItem === "Dashboard" && (
          <div className="min-h-screen">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
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

            {/* Recently Added Books — visible to Admin and SuperAdmin only */}
            {(role === 'Admin' || role === 'SuperAdmin') && (
              <div className="mb-8">
                {/* Admin-only badge header */}
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-semibold">Recently Added Books</h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Admin Only
                  </span>
                </div>
                {recentlyAdded.length === 0 ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F3D2B]"></div>
                  </div>
                ) : (
                  <div className="relative overflow-hidden">
                    <div
                      ref={recentlyAddedRef}
                      className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {[...recentlyAdded, ...recentlyAdded].map((book, index) => (
                        <div
                          key={`added-${book.id}-${index}`}
                          className="flex-shrink-0 w-48 md:w-64 h-36 md:h-48 relative rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                          style={book.thumbnail ? {
                            backgroundImage: `url("${book.thumbnail}")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                          } : undefined}
                          onClick={() => handleOpenBook(book)}
                        >
                          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" />
                          <div className="relative h-full flex flex-col justify-end p-2 md:p-4">
                            <div className="bg-white/40 backdrop-blur-md rounded-xl p-2 md:p-3 border border-white/20">
                              <h3 className="text-xs md:text-sm font-bold text-gray-900 mb-0.5 line-clamp-1 md:line-clamp-2" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8)' }}>{book.title}</h3>
                              <p className="text-[10px] md:text-xs text-gray-700 font-bold opacity-90">{book.author}</p>
                              <span className="mt-1 inline-block text-[8px] md:text-[10px] px-1.5 py-0.5 bg-green-100 text-green-800 rounded font-bold uppercase tracking-wider">New</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recently Viewed Books */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Recently Viewed Books</h2>
              {recentlyViewed.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No recently viewed books yet. Start reading to see them here!</p>
              ) : (
                <div className="relative overflow-hidden">
                  <div
                    ref={recentlyViewedRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {[...recentlyViewed, ...recentlyViewed].map((book, index) => (
                      <div
                        key={`viewed-${book.id}-${index}`}
                        className="flex-shrink-0 w-48 md:w-64 h-36 md:h-48 relative rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                        style={book.thumbnail ? {
                          backgroundImage: `url("${book.thumbnail}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        } : undefined}
                        onClick={() => handleOpenBook(book)}
                      >
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative h-full flex flex-col justify-end p-2 md:p-4">
                          <div className="bg-white/40 backdrop-blur-md rounded-xl p-2 md:p-3 border border-white/20">
                            <h3 className="text-xs md:text-sm font-bold text-gray-900 mb-0.5 line-clamp-1 md:line-clamp-2" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8)' }}>{book.title}</h3>
                            <p className="text-[10px] md:text-xs text-gray-700 font-bold opacity-90">{book.author}</p>
                            <p className="hidden md:block text-[10px] text-gray-500 mt-1">
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
                        className="flex-shrink-0 w-48 md:w-64 h-36 md:h-48 relative rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                        style={book.thumbnail ? {
                          backgroundImage: `url("${book.thumbnail}")`,
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
                        <div className="relative h-full flex flex-col justify-end p-2 md:p-4">
                          <div className="bg-white/40 backdrop-blur-md rounded-xl p-2 md:p-3 border border-white/20">
                            <h3 className="text-xs md:text-sm font-bold text-gray-900 mb-0.5 line-clamp-1 md:line-clamp-2" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8)' }}>{book.title}</h3>
                            <p className="text-[10px] md:text-xs text-gray-700 font-bold opacity-90">{book.author}</p>
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

        <AiLibrarianWidget
          mode="dashboard"
          onNavigate={setActiveItem}
          onOpenBook={setSelectedBook}
        />
      </main>
    </div>
  );
}

export default Dashboard;
