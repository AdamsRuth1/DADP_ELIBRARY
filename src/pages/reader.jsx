import React from "react";

function Reader({ selectedBook, onBack }) {
  if (!selectedBook) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-[#1F3D2B] text-white px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-lg bg-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
          aria-label="Back to library"
        >
          Back
        </button>

        <h1 className="text-lg font-semibold">{selectedBook.title}</h1>

        <a
          href={selectedBook.file}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-white text-[#1F3D2B] px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
        >
          Open PDF
        </a>
      </header>

      <main className="flex-1 p-4" aria-label="PDF reader">
        <iframe
          src={selectedBook.file}
          title={selectedBook.title}
          className="w-full h-[85vh] rounded-xl border border-gray-300 bg-white"
        />
      </main>
    </div>
  );
}

export default Reader;
