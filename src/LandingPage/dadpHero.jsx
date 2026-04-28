import React from "react";
import IctImage from "../assets/IMG_0936.jpeg";
import ICTExam from "../assets/IMG_0937.jpeg";
import GOCVisitImage from "../assets/GOCVISIT.jpg";
import InaugurationImage from "../assets/INUGURATION.jpg";
import PracticalImage from "../assets/IED.jpeg";

const events = [
  {
    title: "GOC Visit",
    description: "Senior leadership inspected our training centre and met with cadets to reinforce DADP‘s readiness mission.",
    image: GOCVisitImage,
  },
  {
    title: "ICT Exam",
    description: "Competency-based testing for cyber and systems students with strong emphasis on security fundamentals.",
    image: ICTExam,
  },
  {
    title: "New Student Inauguration",
    description: "Welcoming fresh recruits and introducing them to the core values of the Directorate.",
    image: InaugurationImage,
  },
  {
    title: "IED Detection Practical",
    description: "Hands-on practical exercise focused on identifying improvised explosive devices and threat indicators.",
    image: PracticalImage,
  },
];

export default function DadpHero() {
  return (
    <>
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

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#C5A64D]">Event Highlights</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1F3D2B] mt-3">Latest DADP Activities</h2>
            </div>

          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {events.map((event) => (
              <div key={event.title} className="rounded-3xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all">
                <img src={event.image} alt={event.title} className="h-48 w-full object-cover" />
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-[#1F3D2B] mb-3">{event.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
