import React from "react";
import IctImage from "../assets/IctImg.jpg"

export default function DadpHero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 lg:py-24" id="home">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="backdrop-blur-sm bg-white/40 p-8 rounded-3xl border border-white/50 shadow-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F3D2B] leading-tight mb-4">
            Department of Automated Data Processing (DADP)
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed font-medium">
            Pioneering the digital frontier and ensuring operational readiness.
            DADP stands at the forefront of automated systems, cyber security,
            and software engineering—equipping our personnel with the cutting-edge
            technical skills required to lead in a modern, data-driven environment.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/elibrary" className="bg-[#1F3D2B] hover:bg-[#162c1f] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#1F3D2B]/30">
              Visit our eLibrary
            </a>
            <a href="#courses" className="border-2 border-[#1F3D2B] bg-transparent text-[#1F3D2B] hover:bg-[#1F3D2B] hover:text-white px-8 py-3 rounded-xl font-bold transition-all">
              Explore Courses
            </a>
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-[#C5A64D] rounded-3xl opacity-20 blur-3xl transform rotate-6"></div>
          <img src={IctImage} alt="Technology Center" className="relative z-10 w-full max-w-lg rounded-2xl shadow-2xl object-cover h-[400px] border-4 border-white" />
        </div>
      </div>
    </section>
  );
}
