import React, { useState, useEffect, useRef } from "react";
import NavBar from "./navigation";
import Logo from "../assets/cyberwarfareLogo.png";
import Coreresponsibility from "./coreResponsibility";
import HowItWorks from "../LandingPage/working";
import InclusiveAccess from "../LandingPage/inclusiveAccess";
import LibraryCategories from "../LandingPage/libraryCategories";
import LandingPageEnding from "../LandingPage/landingPageEnding";
import { API_BASE } from "../config/apiBase";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

function RecentlyAddedBooks() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchRecentBooks() {
      try {
        const res = await fetch(`${API_BASE}/api/books`);
        if (res.ok) {
          const data = await res.json();
          // Take first 12 for a better carousel experience
          setBooks(data.slice(0, 12));
        }
      } catch (err) {
        console.error("Failed to fetch books for landing page", err);
      }
    }
    fetchRecentBooks();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (books.length === 0) return null;

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src="/army logo.jpeg" alt="" className="h-10 w-10 opacity-90" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#1F3D2B]">Recently Added Materials</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="w-4" />
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-[#C5A64D] hover:underline whitespace-nowrap"
            >
              View all →
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map((book) => (
            <div 
              key={book.id} 
              onClick={() => navigate('/login')}
              className="flex-shrink-0 w-40 md:w-56 group cursor-pointer snap-start"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-3 bg-gray-50">
                {book.thumbnail ? (
                  <img 
                    src={book.thumbnail.startsWith('http') ? book.thumbnail : `${API_BASE}${book.thumbnail}`} 
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1F3D2B] flex items-center justify-center p-4 text-center">
                    <span className="text-white text-xs font-bold leading-tight">{book.title}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="bg-white text-[#1F3D2B] px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                    Login to Read
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-[#1F3D2B] transition-colors">{book.title}</h3>
              <p className="text-xs text-gray-500">{book.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingPage() {
  return (
    <div className="relative bg-[#F5F6F4]">
      {/* Background Army Watermark Layer */}
      <div className="army-watermark"></div>

      {/* Page content */}
      <div className="relative z-10">
        <NavBar />

        <div className="">
          <section className="max-w-7xl mx-auto px-6 py-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#1F3D2B] leading-tight">
                  Secure Digital Library for DADP
                </h1>

                <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                  A centralized internal platform designed for secure access to
                  military, engineering, leadership, and operational reference
                  materials.
                </p>

                <div className="mt-8 flex gap-4">
                  <a
                    href="/login"
                    className="bg-[#1F3D2B] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#162c1f] transition-all"
                  >
                    Access Library
                  </a>

                  <a
                    href="#features"
                    className="border border-gray-300 px-6 py-3 rounded-xl font-semibold text-[#1F3D2B] hover:bg-white hover:shadow transition-all"
                  >
                    Learn More
                  </a>
                </div>
              </div>

              <div className="relative flex justify-center">
                <div className="absolute w-80 h-80 bg-[#1F3D2B] rounded-3xl opacity-10 blur-2xl"></div>

                <img
                  src={Logo}
                  alt="preview"
                  className="relative z-10 w-full max-w-md rounded-2xl drop-shadow"
                />
              </div>
            </div>
          </section>

          <RecentlyAddedBooks />

          <section className="max-w-7xl mx-auto px-6">
            <Coreresponsibility />
            <HowItWorks/>
            <InclusiveAccess/>
            <LibraryCategories/>
            <LandingPageEnding />
          </section>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;