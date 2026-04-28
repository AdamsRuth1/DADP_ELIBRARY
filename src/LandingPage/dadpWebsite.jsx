import React from "react";
import DadpNavigation from "./dadpNavigation";
import DadpLeadership from "./dadpLeadership";
import DadpHero from "./dadpHero";
import DadpAbout from "./dadpAbout";
import DadpCommand from "./dadpCommand";
import DadpCourses from "./dadpCourses";
import DadpInstructors from "./dadpInstructors";
import DadpPartnerships from "./dadpPartnerships";
import DadpActivities from "./dadpActivities";
import DadpCeremonies from "./dadpCeremonies";

export default function DadpWebsite() {
  return (
    <div className="relative bg-[#F5F6F4] min-h-screen text-slate-900 font-sans">
      {/* Background Army Watermark Layer */}
      <div className="army-watermark"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <DadpNavigation />
        <DadpLeadership />
        <DadpHero />
        <DadpAbout />
        {/* <DadpCommand /> */}
        <DadpCourses />
        <DadpInstructors />
        <DadpPartnerships />
        <DadpActivities />
        <DadpCeremonies />

        <footer className="bg-black text-gray-400 py-8 text-center text-sm border-t border-gray-800">
          <p>&copy; {new Date().getFullYear()} Department of Automated Data Processing (DADP). All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
