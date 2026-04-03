import React from "react";
import { books } from "../data/books";

function Library({ onOpenBook }) {
  return (
    <section aria-label="Library books">
      <h1 className="text-2xl font-bold mb-6">Library</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {book.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{book.author}</p>
            <p className="text-sm text-gray-500 mt-1">{book.category}</p>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => onOpenBook(book)}
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
        ))}
      </div>
    </section>
  );
}

export default Library;
