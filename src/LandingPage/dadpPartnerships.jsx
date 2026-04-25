import React from "react";

const partners = [
  { name: "Global Cyber Defense Corp", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Cisco_logo.svg", role: "Infrastructure Partner" },
  { name: "Oracle Security Solutions", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg", role: "Database Engineering" },
  { name: "Microsoft Africa", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg", role: "Cloud & Productivity" },
];

export default function DadpPartnerships() {
  return (
    <section className="bg-white py-20 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-[#1F3D2B] mb-4">Strategic ICT Partnerships</h2>
        <div className="w-16 h-1.5 bg-[#C5A64D] mx-auto rounded-full mb-6"></div>
        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          DADP operates at the apex of military technology specifically because of our close integration with global ICT powerhouses. These partnerships grant us unparalleled access to cutting-edge server infrastructure, zero-day threat intelligence, and enterprise-grade academic certifications.
        </p>
        
        <div className="flex flex-wrap justify-center gap-12 items-center opacity-80 mix-blend-multiply">
          {partners.map((partner, idx) => (
             <div key={idx} className="flex flex-col items-center gap-4 group cursor-pointer">
               <div className="w-48 h-20 bg-gray-50 flex items-center justify-center rounded-xl border border-gray-200 shadow-sm group-hover:shadow-md transition-all grayscale group-hover:grayscale-0">
                 <img src={partner.logo} alt={partner.name} className="max-h-12 max-w-[80%] object-contain" />
               </div>
               <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{partner.role}</span>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}
