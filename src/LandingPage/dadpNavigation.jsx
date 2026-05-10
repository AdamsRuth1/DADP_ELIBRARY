import React from "react";
import Logo from "../assets/cyberwarfareLogo.png";

export default function DadpNavigation({ config }) {
  const nav = config || {
    title: "DADP Headquarters",
    subtitle: "Directorate of Automated Data Processing",
    links: [
      { label: "Courses", href: "#courses" },
      { label: "Command", href: "#command" },
      { label: "Activities", href: "#activities" },
      { label: "Ceremonies", href: "#ceremonies" }
    ],
    ctaText: "Visit eLibrary",
    ctaLink: "/elibrary"
  };

  return (
    <header className="sticky top-0 z-50 bg-green-900 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
            <img src={Logo} alt="DADP logo" className="h-8 w-8 object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{nav.title}</h1>
            <p className="text-xs text-white">{nav.subtitle}</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-white">
          {nav.links.map((link, index) => (
            <a key={index} href={link.href} className="text-sm font-medium hover:text-[#C5A64D]">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a href={nav.ctaLink} className="bg-[#C5A64D] text-[#1F3D2B] px-5 py-2 rounded-xl font-semibold hover:bg-[#d4b45a]">
            {nav.ctaText}
          </a>
        </div>
      </div>
    </header>
  );
}
