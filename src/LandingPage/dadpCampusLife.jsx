import React from "react";
import SportsImg from "../assets/sport.jpg";
import IndoorImg from "../assets/sport 2.jpg";
import PowerImg from "../assets/gen.jpg";
import WaterImg from "../assets/water purify.jpg";

export default function DadpCampusLife({ config }) {
  const campusLife = config || {
    heading: "Student Welfare & Premium Infrastructure",
    subheading: "Creating a healthy, high-performance ecosystem for our student defenders with top-tier utilities and healthy recreation.",
    facilities: [
      {
        title: "Evening Games & Sports Recreation",
        description: "Fostering team cohesion, physical stamina, and mental wellness. DADP provides premium sporting facilities and diverse outdoor/indoor recreational games for students to unwind after intensive cyber operations training.",
        tag: "Recreation & Wellness"
      },
      {
        title: "24/7 Uninterrupted Hybrid Power Supply",
        description: "Zero latency, zero downtime. Powered by clean hybrid solar installations and high-capacity silent standby generators, DADP ensures round-the-clock electric power supply to all laboratories and lecture theatres.",
        tag: "Operational Infrastructure"
      },
      {
        title: "Advanced Water Purification Systems",
        description: "Promoting student health and safety. Equipped with professional multi-stage water filtration and industrial purification machines, guaranteeing clean, safe, and healthy drinking and cooking water daily.",
        tag: "Health & Hygiene"
      }
    ]
  };

  const getImagesForFacility = (idx) => {
    if (idx === 0) {
      return (
        <div className="grid grid-cols-2 gap-3 mt-4 h-48">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 group shadow-md">
            <img
              src={SportsImg}
              alt="Outdoor Games"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute bottom-2 left-2 bg-[#1F3D2B] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
              Outdoor
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 group shadow-md">
            <img
              src={IndoorImg}
              alt="Indoor Recreation"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute bottom-2 left-2 bg-[#C5A64D] text-black text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
              Outdoor
            </div>
          </div>
        </div>
      );
    } else if (idx === 1) {
      return (
        <div className="mt-4 h-48 overflow-hidden rounded-2xl border border-gray-200 group shadow-md relative">
          <img
            src={PowerImg}
            alt="Power Infrastructure"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
            <span className="text-white text-xs font-semibold tracking-wider">Uninterrupted Utility Command</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-4 h-48 overflow-hidden rounded-2xl border border-gray-200 group shadow-md relative">
          <img
            src={WaterImg}
            alt="Water Filtration Unit"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
            <span className="text-white text-xs font-semibold tracking-wider">State-of-the-Art Filtration</span>
          </div>
        </div>
      );
    }
  };

  return (
    <section className="bg-[#F5F6F4] py-20 border-t border-b border-gray-200" id="campus-life">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-[#C5A64D] font-bold">Welfare & Logistics</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1F3D2B] mt-4">
            {campusLife.heading}
          </h2>
          <div className="w-24 h-1.5 bg-[#C5A64D] mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            {campusLife.subheading}
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {campusLife.facilities.map((fac, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl shadow-xl border border-gray-150 p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Tag & Title */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider bg-[#1F3D2B]/10 text-[#1F3D2B] px-3 py-1 rounded-full">
                    {fac.tag}
                  </span>
                  {/* Elegant Icon indicator based on category */}
                  <span className="text-gray-400">
                    {idx === 0 && (
                      <svg className="w-6 h-6 text-[#C5A64D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {idx === 1 && (
                      <svg className="w-6 h-6 text-[#C5A64D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    {idx === 2 && (
                      <svg className="w-6 h-6 text-[#C5A64D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    )}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#1F3D2B] mb-3 leading-snug">
                  {fac.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {fac.description}
                </p>
              </div>

              {/* Dynamic Image Display */}
              {getImagesForFacility(idx)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
