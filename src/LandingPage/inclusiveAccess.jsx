import React from "react";
import { Keyboard, Eye, Volume2 } from "lucide-react";

function InclusiveAccess() {
  const items = [
    {
      title: "Keyboard-Friendly Navigation",
      description:
        "All primary actions and navigation flows are designed to work smoothly with keyboard-only interaction.",
      icon: Keyboard,
    },
    {
      title: "Readable Visual Structure",
      description:
        "Clear contrast, spacing, and hierarchy improve readability for low-vision users and reduce visual clutter.",
      icon: Eye,
    },
    {
      title: "Screen Reader Support",
      description:
        "Semantic structure, meaningful labels, and accessible controls help assistive technologies work effectively.",
      icon: Volume2,
    },
  ];

  return (
    <section id="accessibility" className="bg-[#F5F6F4] py-24">
      <div className="mx-auto px-6">
        <div className="rounded-[32px] bg-[#1F3D2B] px-8 py-14 md:px-12 md:py-16 shadow-xl shadow-[#1F3D2B]/15">
          {/* Heading */}
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-white">
              Built for Inclusive Access
            </h2>
            <p className="mt-4 text-base md:text-lg leading-8 text-white/80">
              The DADP eLibrary is designed to support accessible navigation,
              readable interfaces, and compatibility with assistive technologies
              so more users can operate the system confidently.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-white/10 bg-white/10 p-6 backdrop-blur-sm"
                >
                  <div className="h-14 w-14 rounded-2xl bg-white text-[#1F3D2B] flex items-center justify-center">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/75">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InclusiveAccess;