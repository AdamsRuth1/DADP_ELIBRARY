import React from "react";
import GOCVisitImage from "../assets/GOCVISIT.jpg";
import ICTExam from "../assets/IMG_0937.jpeg";
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

export default function DadpEvents() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-20 py-12">
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
  );
}
