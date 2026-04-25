import React, { useState } from "react";
 import CommanderImage from "../assets/NACWC COMD.jpeg";
 import DirectorImage from "../assets/Director.png";

export default function DadpLeadership() {
  const [commanderVision, setCommanderVision] = useState(
    " To Defend The Nigeria Army's Cyberspace, Attack And Neutalize Hostile Digital Threats, And Exploit Cyber Capabilities To Safeguard National Interests, Support Land Operations, And Accomplish Tasks In Aid Of Civil Autority"
  );
  const [directorVision, setDirectorVision] = useState(
    "DADP will transform personnel into elite system administrators capable of managing large datasets, securing networks, and delivering operational readiness in a modern defense environment."
  );

  return (
    <section className="bg-[#F5F6F4] py-16 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[#C5A64D]">Leadership & Vision</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F3D2B] mt-4">
            Commander and Director Spotlight
          </h1>
         
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-28 h-30 rounded-3xl overflow-hidden border-4 border-[#C5A64D] shadow">
                  <img src={CommanderImage} alt="Commander Cyber Warfare" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1F3D2B] leading-tight tracking-tight">
                    MAJ GEN KO OSEMWEGIE
                  </h2>
                  <p className="text-sm font-normal text-gray-600 mt-1">
                    DSS psc(+)fdc(+)FCM MNIM PhD
                  </p>
                  <div className="mt-2 text-sm uppercase tracking-[0.3em] text-[#1F3D2B] font-semibold">
                    <div className="font-bold">Commander</div>
                    <div>Nigeria Army CyberWarfare Command (NACWC)</div>
                  </div>
                </div>
              </div>

              <label className="block  font-bold text-gray-700 mt-6 mb-2"> VISION</label>
              <textarea
                value={commanderVision}
                onChange={(event) => setCommanderVision(event.target.value)}
                rows={5}
                className="w-full italic rounded-3xl border border-gray-200 p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-[#1F3D2B] shadow">
                  <img src={DirectorImage} alt="Director DADP" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1F3D2B] leading-tight tracking-tight">
                    BRIG GEN VE CLETUS
                  </h2>
                  <p className="text-sm font-normal text-gray-600 mt-1">
                    DSS FCM psc fdc MNIM MSC
                  </p>
                  <div className="mt-2 text-sm uppercase tracking-[0.3em] text-[#1F3D2B] font-semibold">
                    <div className="font-bold">Director</div>
                    <div>Department Of Automated Data Processing (DADP)</div>
                  </div>
                </div>
              </div>

              <label className="block  font-bold text-gray-700 mt-6 mb-2"> VISION</label>
              <textarea
                value={directorVision}
                onChange={(event) => setDirectorVision(event.target.value)}
                rows={5}
                className="w-full rounded-3xl border border-gray-200 p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
