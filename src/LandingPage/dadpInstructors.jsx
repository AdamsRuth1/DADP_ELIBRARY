import React, { useState, useEffect } from "react";
import Cordinator from "../assets/PHOTO-2026-04-28-13-10-39.jpg"
import Image1 from "../assets/PHOTO-2026-04-28-13-12-18.jpg"
import Image2 from "../assets/PHOTO-2026-04-28-13-12-19.jpg"
import Image3 from "../assets/PHOTO-2026-04-28-13-12-54.jpg"
import Image4 from "../assets/PHOTO-2026-04-28-13-12-55 - Copy.jpg"

const imageMap = {
  Cordinator,
  Image1,
  Image2,
  Image3,
  Image4,
};

const defaultInstructors = [
  { name: "WO S. ADEBOWALE", role: "CSE COORD", desc: "Ethical Hacking, digital forensic and Advance Excel", img: Cordinator },
  { name: "WO J. ABUE ", role: "", desc: "Dediated to forging the next generation of threat analysts.", img: Image1 },
  { name: "WO SO. DUROJAIYE", role: "CSM", desc: "AI.", img: Image4 },

  { name: "SSGT S. NDAM", role: "INSTRUCTOR", desc: "CCTV.", img: Image2 },
  { name: "WO A. MORUFU", role: "INSTRUCTOR", desc: "MAP READING.", img: Image3 },
  { name: "SGT I. FELIX", role: "INSTRUCTOR", desc: "DRONE AND DATABASE.", img: Image4 },
  // { name: "CPL 0. OLUWAFEMI", role: "INSTRUCTOR", desc: "CYBERSECURITY.", img: Image5 },


];

export default function DadpInstructors({ config }) {
  const instructors = (config?.team || defaultInstructors).map((inst) => ({
    ...inst,
    img: inst.imgKey ? imageMap[inst.imgKey] || Cordinator : inst.img || Cordinator
  }));

  const [currentInstructor, setCurrentInstructor] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentInstructor((prev) => (prev + 1) % instructors.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [instructors.length]);

  const instructorConfig = config || {
    heading: "Elite Dedicated Instructors",
    description: "Our faculty consists of battle-hardened cyber engineers and seasoned database administrators. Their dedication to teaching ensures that every student graduates with unshakeable competence.",
    highlight: "We don't just teach theory. Our instructors physically walk students through grueling live network architectures, ensuring quality education and tactical intuition.",
    team: defaultInstructors
  };

  return (
    <section className="py-20 bg-emerald-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-fixed opacity-10 mix-blend-overlay"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{instructorConfig.heading}</h2>
          <div className="w-24 h-1.5 bg-[#C5A64D] rounded-full mb-8"></div>
          <p className="text-lg text-emerald-100/80 leading-relaxed mb-6">
            {instructorConfig.description}
          </p>
          <p className="text-lg text-emerald-100/80 leading-relaxed">
            {instructorConfig.highlight}
          </p>
        </div>
        <div className="relative h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-800/50">
          {instructors.map((inst, idx) => (
            <div key={idx} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${currentInstructor === idx ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <img src={inst.img} alt={inst.name} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 md:p-8">
                <h4 className="text-lg md:text-2xl font-bold text-white">{inst.name}</h4>
                <p className="text-[#C5A64D] font-bold text-[10px] md:text-sm uppercase tracking-wider mb-1 md:mb-2">{inst.role}</p>
                <p className="text-gray-300 italic text-xs md:text-base line-clamp-2 md:line-clamp-none">"{inst.desc}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
