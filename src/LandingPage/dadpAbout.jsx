import React from "react";

export default function DadpAbout({ config }) {
  const about = config || {
    heading: "About The Directorate",
    subheading: "Established in 1983, the Directorate of Automated Data Processing (DADP) was forged to primarily advise the Chief of Army Staff (COAS) through the COA(A) on all critical matters concerning ICT and data automation within the Nigerian Army.",
    roles: [],
    departments: {
      heading: "Organizational Structure",
      description: "The DADP is structurally organized into 4 distinct departments: Training, Documentation, ADP, and Research & Development (R&D). Operations are currently spearheaded by our elite Training and Documentation wings.",
      cards: []
    }
  };

  return (
    <section className="py-20 bg-[#F5F6F4]" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1F3D2B] mb-4">{about.heading}</h2>
          <div className="w-24 h-1.5 bg-[#C5A64D] mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            {about.subheading}
          </p>
        </div>

        {/* General Roles Grid */}
        <div className="mb-20">
           <h3 className="text-2xl font-bold text-[#1F3D2B] mb-8 flex items-center gap-3">
             <span className="w-1.5 h-8 bg-[#C5A64D] rounded-full inline-block"></span>
             General Operational Roles
           </h3>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {about.roles.map((role, idx) => (
               <div key={idx} className="group relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(31,61,43,0.3)] hover:border-[#C5A64D]/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                 {/* Giant Watermark Number */}
                 <div className="absolute -right-4 -bottom-8 text-[120px] font-black text-gray-50 group-hover:text-[#C5A64D]/5 transition-colors select-none z-0">
                    0{idx + 1}
                 </div>
                 
                 <div className="relative z-10 flex-1">
                   <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1F3D2B] to-emerald-950 flex items-center justify-center text-[#C5A64D] mb-6 shadow-lg shadow-[#1F3D2B]/20 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   </div>
                   <h4 className="text-xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-[#1F3D2B] transition-colors">{role.title}</h4>
                   <p className="text-[15px] font-medium text-gray-500 leading-relaxed">{role.desc}</p>
                 </div>

                 {/* Animated Footer text */}
                 <div className="relative z-10 mt-8 pt-4 border-t border-gray-100/80">
                   <span className="text-xs font-bold text-[#C5A64D] tracking-widest uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                     Strategic Core <span className="text-lg">→</span>
                   </span>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Operational Departments */}
        <div className="bg-[#1F3D2B] rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C5A64D] opacity-10 rounded-full blur-3xl"></div>
           <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">{about.departments.heading}</h3>
              <p className="text-gray-300 mb-10 max-w-2xl text-lg">
                {about.departments.description}
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                 {about.departments.cards.map((card, idx) => (
                   <div key={idx} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                      <h4 className="text-2xl font-bold text-[#C5A64D] mb-4">{card.title}</h4>
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {card.desc}
                      </p>
                      <ul className="space-y-3 text-sm text-gray-200">
                        {card.bullets?.map((bullet, bid) => (
                          <li key={bid} className="flex items-start gap-2">✓ <span className="flex-1">{bullet}</span></li>
                        ))}
                      </ul>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
