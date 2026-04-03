import React from "react";
import { useNavigate } from "react-router-dom";

import { SidebarData } from "./sidebarData";

function Sidebar({ activeItem = "Dashboard", onNavigate }) {
  return (
    <aside
      className="h-screen w-64 bg-[#1F3D2B] text-white flex flex-col border-r border-[#2c4d39] shadow-lg"
      aria-label="Main sidebar navigation"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#2c4d39]">
        <h1 className="text-xl font-bold tracking-wide">DADP eLibrary</h1>
        <p className="mt-1 text-xs text-green-100/70">
          Internal Knowledge Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2" aria-label="Sidebar menu">
        {SidebarData.map((item, index) => {
          const isActive = activeItem === item.title;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onNavigate && onNavigate(item.title)}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C5A64D] focus:ring-offset-2 focus:ring-offset-[#1F3D2B] ${
                isActive
                  ? "bg-white text-[#1F3D2B] shadow-md font-semibold"
                  : "text-white hover:bg-[#2c4d39]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={`text-lg ${
                  isActive ? "text-[#1F3D2B]" : "text-green-100"
                }`}
                aria-hidden="true"
              >
                {item.icon}
              </span>

              <span className="text-sm">{item.title}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#2c4d39]">
        <p className="text-xs text-green-100/70">© 2026 DADP</p>
      </div>
    </aside>
  );
}

export default Sidebar;
