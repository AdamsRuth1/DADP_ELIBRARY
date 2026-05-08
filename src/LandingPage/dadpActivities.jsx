import React from "react";
import Classroom1 from "../assets/ClassRoom.jpeg"
import Practical from "../assets/Practical.jpeg"
import Classroom4 from "../assets/IMG-20260415-WA0065 - Copy.jpg"
import Classroom2 from "../assets/20260216_101719.jpg"
import Classroom5 from "../assets/IMG-20260129-WA0057.jpg"
import Classroom6 from "../assets/IMG-20260129-WA0038.jpg"

const photos = [Classroom1, Practical, Classroom2, Classroom4, Classroom5, Classroom6];

export default function DadpActivities({ config }) {
  const activities = config || {
    heading: "World-Class Study Environment",
    highlight: "24/7 Unrestricted High-Speed Internet",
    highlightDetails: "All students are granted round-the-clock free internet access within our heavily optimized, air-conditioned study environments. We ensure every operational resource is available uninterrupted to guarantee proper learning retention.",
    body: "Our classroom engagements prioritize immersive, hands-on practical activities over raw theory. Instructors force students into intense simulations to tackle real-life operational scenarios on live networks.",
    list: []
  };

  return (
    <section className="bg-slate-900 text-white py-20" id="activities">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{activities.heading}</h2>
            <div className="w-24 h-1.5 bg-[#C5A64D] rounded-full mb-6"></div>

            <div className="bg-[#1F3D2B]/40 p-6 rounded-2xl border border-[#1F3D2B] mb-6">
              <h4 className="flex items-center gap-2 font-bold text-[#C5A64D] text-lg mb-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
                {activities.highlight}
              </h4>
              <p className="text-gray-300 text-sm">
                {activities.highlightDetails}
              </p>
            </div>

            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              {activities.body}
            </p>
            <ul className="space-y-3">
              {activities.list.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-200">
                  <svg className="w-5 h-5 text-[#C5A64D]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <img src={Classroom1} alt="Classroom 1" className="rounded-xl object-cover h-32 w-full shadow-lg" />
            <img src={Practical} alt="Classroom 2" className="rounded-xl object-cover h-40 w-full shadow-lg translate-y-4" />
            <img src={Classroom2} alt="Classroom 3" className="rounded-xl object-cover h-32 w-full shadow-lg" />
            <img src={Classroom4} alt="Classroom 4" className="rounded-xl object-cover h-40 w-full shadow-lg -translate-y-4 sm:translate-y-8" />
            <img src={Classroom6} alt="Classroom 4" className="rounded-xl object-cover h-40 w-full shadow-lg -translate-y-4 sm:translate-y-8" />
            <img src={Classroom5} alt="Classroom 4" className="rounded-xl object-cover h-40 w-full shadow-lg -translate-y-4 sm:translate-y-8" />


          </div>
        </div>
      </div>
    </section>
  );
}
