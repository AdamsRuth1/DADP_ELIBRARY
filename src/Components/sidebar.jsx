import React from "react";
import { useNavigate } from "react-router-dom";

import { SidebarData } from "./sidebarData";

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(
      json.split('').map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join('')
    ));
  } catch {
    return null;
  }
}

function Sidebar({ activeItem = "Dashboard", onNavigate, role }) {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const user = token ? parseJwt(token) : null;
  const displayName = user?.name || user?.serviceID || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <aside
    className="fixed top-0 left-0 z-50 h-screen w-64 bg-[#1F3D2B] text-white flex flex-col border-r border-[#2c4d39] shadow-lg"
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
          // hide Management item unless Admin or SuperAdmin
          if (item.title === 'Users' && !(role === 'Admin' || role === 'SuperAdmin')) return null;
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

            <span className="text-sm">{item.title === 'Users' && role === 'SuperAdmin' ? 'Users' : item.title}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#2c4d39]">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-[#1F3D2B]">
            <span aria-hidden="true">👤</span>
          </div>
          <div>
            <p className="text-sm font-semibold">{displayName}</p>
            <p className="text-xs text-green-100/70">{role || 'Guest'}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl bg-[#2c4d39] px-4 py-2 text-sm text-white hover:bg-[#3f5f41] focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
        >
          Logout
        </button>

        <p className="mt-4 text-xs text-green-100/70">© 2026 DADP</p>
      </div>
    </aside>
  );
}

export default Sidebar;
