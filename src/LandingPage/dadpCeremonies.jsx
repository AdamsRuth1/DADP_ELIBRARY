import React, { useState, useEffect } from "react";
import Classroom2 from "../assets/IMG-20260407-WA0086.jpg"
import Classroom3 from "../assets/IMG-20260407-WA0116.jpg"
import Classroom4 from "../assets/IMG-20260407-WA0115.jpg"
import Classroom5 from "../assets/IMG-20260407-WA0066.jpg"


export default function DadpCeremonies({ config }) {
  const slides = config?.slides || [
    { title: "Celebrating Excellence", subtitle: "Recognizing the dedication and mastery of our graduating professionals" },
    { title: "Honoring Achievement", subtitle: "Ceremonies that reflect our commitment to elite training and service." },
    { title: "Celebrating Excellence", subtitle: "Moments that define the next generation of digital defenders." }
  ];

  const [currentCeremony, setCurrentCeremony] = useState(0);
  const ceremonies = [Classroom2, Classroom3, Classroom4];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCeremony((prev) => (prev + 1) % ceremonies.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [ceremonies.length]);

  return (
    <section className="py-20" id="ceremonies">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F3D2B] mb-4">{config?.heading || "Graduation & Ceremonies"}</h2>
          <div className="w-24 h-1.5 bg-[#C5A64D] mx-auto rounded-full"></div>
        </div>

        <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-black">
          {ceremonies.map((imgSrc, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentCeremony === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <img src={imgSrc} alt={`Ceremony ${idx + 1}`} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
                <div className="p-4 md:p-12 w-full text-center">
                  <h3 className="text-lg md:text-3xl font-bold text-white mb-1 md:mb-2">{slides[idx]?.title}</h3>
                  <p className="text-gray-200 text-xs md:text-base">{slides[idx]?.subtitle}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {ceremonies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentCeremony(idx)}
                className={`w-3 h-3 rounded-full transition-all ${currentCeremony === idx ? 'bg-[#C5A64D] scale-125' : 'bg-white/50'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
