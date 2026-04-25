import React from "react";
import Logo from "../assets/cyberwarfareLogo.png";

export default function DadpNavigation() {
  return (
    <header className="sticky top-0 z-50 bg-green-900 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
            <img src={Logo} alt="DADP logo" className="h-8 w-8 object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">DADP Headquarters</h1>
            <p className="text-xs text-white">Department of Automated Data Processing</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-white">
          <a href="#courses" className="text-sm font-medium hover:text-[#C5A64D]">Courses</a>
          <a href="#command" className="text-sm font-medium hover:text-[#C5A64D]">Command</a>
          <a href="#activities" className="text-sm font-medium hover:text-[#C5A64D]">Activities</a>
          <a href="#ceremonies" className="text-sm font-medium hover:text-[#C5A64D]">Ceremonies</a>
        </nav>

        <div className="hidden md:block">
          <a href="/elibrary" className="bg-[#C5A64D] text-[#1F3D2B] px-5 py-2 rounded-xl font-semibold hover:bg-[#d4b45a]">
            Visit eLibrary
          </a>
        </div>
      </div>
    </header>
  );
}
