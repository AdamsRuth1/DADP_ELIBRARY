import React from "react";
import NavBar from "./navigation";
import Logo from "../assets/cyberwarfareLogo.png";
import Coreresponsibility from "./coreResponsibility";
import HowItWorks from "../LandingPage/working"
import InclusiveAccess from "../LandingPage/inclusiveAccess"
import LibraryCategories from "../LandingPage/libraryCategories"
import LandingPageEnding from "../LandingPage/landingPageEnding"
function LandingPage() {
  return (
    <div className="relative bg-[#F5F6F4]">
      {/* Background layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <img
          src={Logo}
          alt=""
          className="w-[500px] opacity-5 select-none"
        />
      </div>

      {/* Page content */}
      <div className="relative z-10">
        <NavBar />

        <div className="">
          <section className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#1F3D2B] leading-tight">
                  Secure Digital Library for DADP
                </h1>

                <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                  A centralized internal platform designed for secure access to
                  military, engineering, leadership, and operational reference
                  materials.
                </p>

                <div className="mt-8 flex gap-4">
                  <a
                    href="/login"
                    className="bg-[#1F3D2B] text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Access Library
                  </a>

                  <a
                    href="#features"
                    className="border border-gray-300 px-6 py-3 rounded-xl font-semibold text-[#1F3D2B]"
                  >
                    Learn More
                  </a>
                </div>
              </div>

              <div className="relative flex justify-center">
                <div className="absolute w-80 h-80 bg-[#1F3D2B] rounded-3xl opacity-10 blur-2xl"></div>

                <img
                  src={Logo}
                  alt="preview"
                  className="relative z-10 w-full max-w-md rounded-2xl drop-shadow"
                />
              </div>
            </div>

            <Coreresponsibility />
            <HowItWorks/>
            <InclusiveAccess/>
            <LibraryCategories/>
            <LandingPageEnding />
          </section>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;