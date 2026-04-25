import React from "react";
import Classroom1 from "../assets/ClassRoom.jpeg"
import Practical from "../assets/Practical.jpeg"
const CLASSROOM_3 = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const CLASSROOM_4 = "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const CLASSROOM_5 = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const CLASSROOM_6 = "https://images.unsplash.com/photo-1571260899304-425dea4cf36e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";

export default function DadpActivities() {
  return (
    <section className="bg-slate-900 text-white py-20" id="activities">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">World-Class Study Environment</h2>
            <div className="w-24 h-1.5 bg-[#C5A64D] rounded-full mb-6"></div>

            <div className="bg-[#1F3D2B]/40 p-6 rounded-2xl border border-[#1F3D2B] mb-6">
              <h4 className="flex items-center gap-2 font-bold text-[#C5A64D] text-lg mb-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
                24/7 Unrestricted High-Speed Internet
              </h4>
              <p className="text-gray-300 text-sm">
                All students are granted round-the-clock free internet access within our heavily optimized, air-conditioned study environments. We ensure every operational resource is available uninterrupted to guarantee proper learning retention.
              </p>
            </div>

            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Our classroom engagements prioritize immersive, hands-on practical activities over raw theory. Instructors force students into intense simulations to tackle real-life operational scenarios on live networks.
            </p>
            <ul className="space-y-3">
              {['Intense Hands-On Practical Activities', 'Real-time Threat Simulation Scenarios', 'Collaborative Operations Tactics', 'Hardware Assembly & Server Racking'].map((item, i) => (
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
            <img src={CLASSROOM_3} alt="Classroom 3" className="rounded-xl object-cover h-32 w-full shadow-lg" />
            <img src={CLASSROOM_4} alt="Classroom 4" className="rounded-xl object-cover h-40 w-full shadow-lg -translate-y-4 sm:translate-y-8" />
            <img src={CLASSROOM_5} alt="Classroom 5" className="rounded-xl object-cover h-32 w-full shadow-lg translate-y-2 sm:-translate-y-0" />
            <img src={CLASSROOM_6} alt="Classroom 6" className="rounded-xl object-cover h-40 w-full shadow-lg translate-y-6 sm:translate-y-12" />
          </div>
        </div>
      </div>
    </section>
  );
}
