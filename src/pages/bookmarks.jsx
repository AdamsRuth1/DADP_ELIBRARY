import React, { useEffect, useMemo, useState } from "react";

function loadBookmarks() {
  try {
    const raw = localStorage.getItem("bookBookmarks");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks) {
  localStorage.setItem("bookBookmarks", JSON.stringify(bookmarks));
}

function Bookmarks({ onOpenBook }) {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    setBookmarks(loadBookmarks());

    const onStorage = (e) => {
      if (e.key === "bookBookmarks") setBookmarks(loadBookmarks());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const bm of bookmarks) {
      const key = String(bm.bookId ?? "unknown");
      const list = map.get(key) || [];
      list.push(bm);
      map.set(key, list);
    }
    for (const [, list] of map) {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return Array.from(map.entries());
  }, [bookmarks]);

  const removeBookmark = (id) => {
    const next = bookmarks.filter((b) => b.id !== id);
    setBookmarks(next);
    saveBookmarks(next);
  };

  const clearAll = () => {
    if (!confirm("Clear all bookmarks?")) return;
    setBookmarks([]);
    saveBookmarks([]);
  };

  return (
    <section className="min-h-screen pl-[15px]" aria-label="Bookmarks">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bookmarks</h1>
          <p className="mt-2 text-gray-600">
            Save key moments while reading. Your bookmarks are stored on this device.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={clearAll}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
          >
            Clear all
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900">No bookmarks yet</h2>
          <p className="mt-2 text-gray-600">
            Open any book and tap <span className="font-semibold">Bookmark</span> to save your spot with a note.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([bookId, list]) => {
            const first = list[0] || {};
            return (
              <div key={bookId} className="bg-white border rounded-xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {first.bookTitle || "Untitled book"}
                    </h2>
                    <p className="text-sm text-gray-600">{first.bookAuthor || ""}</p>
                  </div>
                  {onOpenBook && first.bookSnapshot && (
                    <button
                      onClick={() => onOpenBook(first.bookSnapshot)}
                      className="px-4 py-2 rounded-lg bg-[#1F3D2B] text-white hover:bg-[#2A4A3A] focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
                    >
                      Open book
                    </button>
                  )}
                </div>

                <div className="mt-4 divide-y">
                  {list.map((bm) => (
                    <div key={bm.id} className="py-4 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            {typeof bm.progress === "number" ? `${bm.progress}%` : "Saved"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {bm.createdAt ? new Date(bm.createdAt).toLocaleString() : ""}
                          </span>
                        </div>
                        {bm.note ? (
                          <p className="mt-2 text-gray-800 whitespace-pre-wrap break-words">{bm.note}</p>
                        ) : (
                          <p className="mt-2 text-gray-500 italic">No note</p>
                        )}
                      </div>

                      <button
                        onClick={() => removeBookmark(bm.id)}
                        className="shrink-0 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
                        aria-label="Remove bookmark"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Bookmarks;

