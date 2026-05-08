import React from "react";
import CommanderImage from "../assets/comd.png";
import DirectorImage from "../assets/Director.png";
import IctImage from "../assets/IMG_0936.jpeg";

export default function DadpLeadership({ config }) {
  const leadership = config || {
    sectionLabel: "Leadership & Vision",
    header: "Commander and Director Spotlight",
    commander: {
      name: "MAJ GEN KO OSEMWEGIE",
      rank: "DSS psc(+)fdc(+)FCM MNIM PhD",
      role: "Commander, Nigeria Army CyberWarfare Command (NACWC)",
      vision: "To defend the Nigeria Army's cyberspace, attack and neutralize hostile digital threats, and exploit cyber capabilities to safeguard national interests, support land operations, and accomplish tasks in aid of civil authority."
    },
    director: {
      name: "BRIG GEN VE CLETUS",
      rank: "DSS FCM psc fdc MNIM MSC",
      role: "Director, Directorate Of Automated Data Processing (DADP)",
      overview: "Established in 1983, the Directorate of Automated Data Processing (DADP) was forged to primarily advise the Chief of Army Staff (COAS) on all critical matters concerning ICT, data automation, and Management Information Systems within the Nigerian Army."
    }
  };

  return (
    <section className="bg-[#F5F6F4] py-6 md:py-16 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[#C5A64D]">Leadership & Vision</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F3D2B] mt-4">
            Commander and Director Spotlight
          </h1>

        </div>

        <div className="flex gap-10 flex-col">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex-1 w-full order-2 md:order-1">
                <h2 className="text-xl md:text-3xl font-bold text-[#1F3D2B] leading-tight tracking-tight">
                  {leadership.commander.name}
                </h2>
                <p className="text-sm md:text-base font-normal text-gray-600 mt-1">
                  {leadership.commander.rank}
                </p>
                <div className="mt-4 text-sm uppercase tracking-[0.3em] text-[#1F3D2B] font-semibold">
                  <div className="font-bold">Commander</div>
                  <div>{leadership.commander.role}</div>
                </div>

                <div className="mt-8 rounded-3xl border border-gray-200 bg-slate-50 p-4 text-gray-700">
                  <p className="italic leading-relaxed text-sm md:text-base">
                    {leadership.commander.vision}
                  </p>
                </div>
              </div>

              <div className="w-64 h-64 md:w-[22rem] md:h-[28rem] shrink-0 rounded-3xl overflow-hidden shadow-lg order-1 md:order-2">
                <img src={CommanderImage} alt="Commander Cyber Warfare" className="w-full h-full object-cover object-top" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-64 h-64 md:w-[22rem] md:h-[28rem] shrink-0 rounded-3xl overflow-hidden shadow-lg order-1 md:order-2">
                <img src={DirectorImage} alt="Director DADP" className="w-full h-full object-cover object-top" />
              </div>

              <div className="flex-1 w-full order-2 md:order-2">
                <h2 className="text-xl md:text-3xl font-bold text-[#1F3D2B] leading-tight tracking-tight">
                  {leadership.director.name}
                </h2>
                <p className="text-sm md:text-base font-normal text-gray-600 mt-1">
                  {leadership.director.rank}
                </p>
                <div className="mt-4 text-sm uppercase tracking-[0.3em] text-[#1F3D2B] font-semibold">
                  <div className="font-bold">Director</div>
                  <div>{leadership.director.role}</div>
                </div>

                <div className="mt-8">
                  <div className="bg-[#1F3D2B]/5 rounded-3xl p-6 border border-[#1F3D2B]/10">
                    <p className="text-gray-700 leading-relaxed italic text-sm md:text-base">
                      {leadership.director.overview}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[#1F3D2B] font-bold text-xs uppercase tracking-widest">
                      <span className="w-8 h-0.5 bg-[#C5A64D]"></span>
                      Strategic Data Core
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
