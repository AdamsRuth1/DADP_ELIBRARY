import React, { useState } from "react";
import Sidebar from "../Components/sidebar";
import Library from "../pages/library";
import Reader from "../pages/reader"

function Dashboard() {
  const [activeItem, setActiveItem] = useState("Library");
  const [selectedBook, setSelectedBook] = useState(null);

  if (selectedBook) {
    return (
      <Reader
        selectedBook={selectedBook}
        onBack={() => setSelectedBook(null)}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeItem={activeItem} onNavigate={setActiveItem} />

      <main className="flex-1 p-6">
        {activeItem === "Library" && (
          <Library onOpenBook={setSelectedBook} />
        )}

        {activeItem === "Dashboard" && (
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome to the DADP eLibrary dashboard.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
