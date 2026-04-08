import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../assets/cyberwarfareLogo.jpeg";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-green-900 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
            <img
              src={Logo}
              alt="DADP logo"
              className="h-8 w-8 object-contain"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">DADP eLibrary</h1>
            <p className="text-xs text-white">Internal Knowledge Portal</p>
          </div>
        </div>

        <nav
          className="hidden md:flex items-center gap-8 text-white"
          aria-label="Primary Navigation"
        >
          <a
            href="#features"
            className="text-sm font-medium hover:text-[#C5A64D] focus:outline-none focus:ring-2 focus:ring-[#C5A64D] rounded"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium hover:text-[#C5A64D] focus:outline-none focus:ring-2 focus:ring-[#C5A64D] rounded"
          >
            How It Works
          </a>

          <a
            href="#categories"
            className="text-sm font-medium hover:text-[#C5A64D] focus:outline-none focus:ring-2 focus:ring-[#C5A64D] rounded"
          >
            Categories
          </a>

          <a
            href="#accessibility"
            className="text-sm font-medium hover:text-[#C5A64D] focus:outline-none focus:ring-2 focus:ring-[#C5A64D] rounded"
          >
            Accessibility
          </a>
        </nav>

        <div className="hidden md:block">
          <Link
            to="/login"
            className="bg-[#C5A64D] text-[#1F3D2B] px-5 py-2 rounded-xl font-semibold hover:bg-[#d4b45a] focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
          >
            Login
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
          aria-label="Toggle menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-6 py-4 space-y-4">
          <a
            href="#features"
            className="block text-sm text-gray-700 hover:text-[#1F3D2B]"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="block text-sm text-gray-700 hover:text-[#1F3D2B]"
          >
            How It Works
          </a>

          <a
            href="#categories"
            className="block text-sm text-gray-700 hover:text-[#1F3D2B]"
          >
            Categories
          </a>

          <a
            href="#accessibility"
            className="block text-sm text-gray-700 hover:text-[#1F3D2B]"
          >
            Accessibility
          </a>

          <Link
            to="/login"
            className="block w-full text-center bg-[#1F3D2B] text-white py-2 rounded-lg"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;