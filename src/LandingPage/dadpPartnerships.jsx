import React from "react";
import Lasu from "../assets/PHOTO-2026-04-25-16-08-37.jpg";

const partnerImages = {
  Lasu,
};

export default function DadpPartnerships({ config }) {
  const partnerships = config?.partners || [
    { name: "LASU", imgKey: "Lasu", role: "Infrastructure Partner" },
  ];

  const heading = config?.heading || "Strategic ICT Partnerships";
  const description = config?.description || "DADP operates at the apex of military technology...";

  return (
    <section className="bg-white py-20 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-[#1F3D2B] mb-4">
          {heading}
        </h2>

        <div className="w-16 h-1.5 bg-[#C5A64D] mx-auto rounded-full mb-6"></div>

        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          {description}
        </p>

        <div className="flex flex-wrap justify-center gap-16 items-center">
          {partnerships.map((partner, idx) => (
            <div
              key={`${partner.name}-${idx}`}
              className="flex flex-col items-center gap-6 group cursor-pointer"
            >
              <div className="transition-all transform group-hover:scale-110">
                <img
                  src={partnerImages[partner.imgKey] || partner.img}
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