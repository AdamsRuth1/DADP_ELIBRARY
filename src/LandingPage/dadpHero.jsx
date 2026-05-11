import React from "react";
import IctImage from "../assets/IMG_0936.jpeg";

export default function DadpHero({ config }) {
  const hero = config || {
    heading: "DADP",
    subtitle: "Pioneering the digital frontier. DADP stands at the forefront of automated systems and cyber security.",
    primaryText: "eLibrary",
    primaryHref: "/elibrary",
    secondaryText: "Courses",
    secondaryHref: "#courses"
  };

  return (
    <>
      <section className="max-w-7xl mx-auto px-2 md:px-6 py-4 md:py-24" id="home">
        <div className="backdrop-blur-sm bg-white/40 p-4 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-white/50 shadow-2xl flex flex-row items-center gap-4 md:gap-16">
          <div className="flex-[1.5] text-left">
            <h1 className="text-sm md:text-5xl font-extrabold text-[#1F3D2B] leading-tight mb-2 md:mb-4">
              {hero.heading}
            </h1>
            <p className="text-[10px] md:text-lg text-gray-700 leading-tight md:leading-relaxed font-medium mb-4 md:mb-8">
              {hero.subtitle}
            </p>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <a href={hero.primaryHref} className="bg-[#1F3D2B] text-white px-2 md:px-8 py-2 md:py-3 rounded-lg md:xl font-bold text-[8px] md:text-base text-center">
                {hero.primaryText}
              </a>
              <a href={hero.secondaryHref} className="border border-[#1F3D2B] text-[#1F3D2B] px-2 md:px-8 py-2 md:py-3 rounded-lg md:xl font-bold text-[8px] md:text-base text-center">
                {hero.secondaryText}
              </a>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <img 
              src={IctImage} 
              alt="Technology Center" 
              className="relative z-10 w-full rounded-xl md:rounded-2xl shadow-lg object-cover h-[120px] md:h-[400px] border border-white/50" 
            />
          </div>
        </div>
      </section>
    </>
  );
}
