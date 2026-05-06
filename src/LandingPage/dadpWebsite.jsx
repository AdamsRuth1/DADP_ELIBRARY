import React from "react";
import DadpNavigation from "./dadpNavigation";
import DadpLeadership from "./dadpLeadership";
import DadpHero from "./dadpHero";
import DadpAbout from "./dadpAbout";
import DadpCommand from "./dadpCommand";
import DadpCourses from "./dadpCourses";
import DadpInstructors from "./dadpInstructors";
import DadpEvents from "./dadpEvents";
import DadpPartnerships from "./dadpPartnerships";
import DadpActivities from "./dadpActivities";
import DadpCeremonies from "./dadpCeremonies";
import { useScrollAnimations } from "../hooks/useScrollAnimations";

export default function DadpWebsite() {
  const containerRef = React.useRef(null);
  useScrollAnimations(containerRef);

  return (
    <div className="relative bg-[#F5F6F4] min-h-screen text-slate-900 font-sans" ref={containerRef}>
      {/* Background Army Watermark Layer */}
      <div className="army-watermark"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <DadpNavigation />
        <div className="animate-section">
          <DadpLeadership />
          <DadpHero />
          <DadpAbout />
          <DadpCommand />
          <DadpCourses />
          <DadpInstructors />
          <DadpEvents />
          <DadpPartnerships />
          <DadpActivities />
          <DadpCeremonies />
        </div>

        <footer className="bg-black text-gray-400 py-8 text-center text-sm border-t border-gray-800 animate-section">
          <p>&copy; {new Date().getFullYear()} Directorate of Automated Data Processing (DADP). All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

