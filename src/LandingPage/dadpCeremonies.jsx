import React, { useState, useEffect } from "react";
import Classroom2 from "../assets/IMG-20260407-WA0086.jpg"

const CEREMONY_1 = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
const CEREMONY_2 = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
const CEREMONY_3 = "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

export default function DadpCeremonies() {
  const [currentCeremony, setCurrentCeremony] = useState(0);
  const ceremonies = [Classroom2, CEREMONY_2, CEREMONY_3];

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
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F3D2B] mb-4">Graduation & Ceremonies</h2>
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
                <div className="p-8 md:p-12 w-full text-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Celebrating Excellence</h3>
                  <p className="text-gray-200">Recognizing the dedication and mastery of our graduating professionals</p>
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
