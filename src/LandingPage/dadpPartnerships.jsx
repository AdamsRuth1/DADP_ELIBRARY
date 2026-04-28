import React from "react";
import Lasu from "../assets/PHOTO-2026-04-25-16-08-37.jpg";

const partners = [
  { name: "LASU", img: Lasu, role: "Infrastructure Partner" },
];

export default function DadpPartnerships() {
  return (
    <section className="bg-white py-20 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-[#1F3D2B] mb-4">
          Strategic ICT Partnerships
        </h2>

        <div className="w-16 h-1.5 bg-[#C5A64D] mx-auto rounded-full mb-6"></div>

        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          DADP operates at the apex of military technology...
        </p>

        <div className="flex flex-wrap justify-center gap-16 items-center">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-6 group cursor-pointer"
            >
              <div className="transition-all transform group-hover:scale-110">
                <img
                  src={partner.img}
                  alt={partner.name}
                  className="h-32 w-auto object-contain drop-shadow-xl"
                />
              </div>

              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-[#1F3D2B] uppercase tracking-[0.2em]">
                  {partner.name}
                </span>
                <span className="text-xs font-semibold text-[#C5A64D] uppercase tracking-widest mt-1">
                  {partner.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}