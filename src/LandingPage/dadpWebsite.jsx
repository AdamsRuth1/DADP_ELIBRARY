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
import DadpCampusLife from "./dadpCampusLife";
import DadpCeremonies from "./dadpCeremonies";
import { useScrollAnimations } from "../hooks/useScrollAnimations";
import { useLandingConfig } from "../hooks/useLandingConfig";

export default function DadpWebsite() {
  const containerRef = React.useRef(null);
  useScrollAnimations(containerRef);
  const { config } = useLandingConfig();

  return (
    <div className="relative bg-[#F5F6F4] min-h-screen text-slate-900 font-sans" ref={containerRef}>
      {/* Background Army Watermark Layer */}
      <div className="army-watermark"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <DadpNavigation config={config.navigation} />
        <div className="animate-section">
          <DadpLeadership config={config.leadership} />
          <DadpHero config={config.hero} />
          <DadpAbout config={config.about} />
          <DadpCommand config={config.command} />
          <DadpCourses config={config.courses} />
          <DadpInstructors config={config.instructors} />
          <DadpEvents config={config.events} />
          <DadpPartnerships config={config.partnerships} />
          <DadpActivities config={config.activities} />
          <DadpCampusLife config={config.campusLife} />
          <DadpCeremonies config={config.ceremonies} />
        </div>

        <footer className="bg-black text-gray-400 py-8 text-center text-sm border-t border-gray-800 animate-section">
          <p>&copy; {new Date().getFullYear()} Directorate of Automated Data Processing (DADP). All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

