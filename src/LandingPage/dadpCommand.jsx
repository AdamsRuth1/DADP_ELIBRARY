import React from "react";
import Comd2 from "../assets/PHOTO-2026-04-27-15-09-25.jpg"
import Comd1 from "../assets/PHOTO-2026-04-27-15-09-21.jpg"
import Comd3 from "../assets/PHOTO-2026-04-27-15-09-37.jpg"
import Director from "../assets/Director.png"
export default function DadpCommand({ config }) {
  const command = config || {
    heading: "Command & Leadership",
    description: "The strategic visionaries guiding the Directorate of Automated Data Processing towards cyber excellence.",
    cards: [],
    staffIntro: "DADP Key Operational Staff",
    staffRoles: []
  };
  return (
    <section className="bg-white/95 backdrop-blur-md py-20 border-t border-gray-200" id="command">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1F3D2B] mb-4">{command.heading}</h2>
          <div className="w-24 h-1.5 bg-[#C5A64D] mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            {command.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {command.cards.map((card, idx) => (
            <div key={idx} className="flex flex-col md:flex-row bg-slate-50 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 items-center md:items-start gap-8">
              <img
                src={idx === 4 ? Director : [Comd1, Comd2, Comd3][idx % 3]}
                alt={card.title}
                className="w-40 h-40 object-cover rounded-2xl shadow-lg border-4 border-white"
              />
              <div>
                <h3 className="text-2xl font-bold text-[#1F3D2B]">{card.title}</h3>
                <p className="text-[#C5A64D] font-bold mb-4">{card.subtitle}</p>
                {card.quote && (
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-[#C5A64D] pl-4">
                    {card.quote}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* <div className="bg-[#1F3D2B] text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#C5A64D] rounded-full inline-block"></span>
            {command.staffIntro}
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
            {command.staffRoles.map((staff, idx) => (
              <div key={idx} className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
                <h4 className="font-bold text-[#C5A64D] mb-2">{staff.role}</h4>
                <p className="text-sm text-gray-300">{staff.desc}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
