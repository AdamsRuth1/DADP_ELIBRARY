import React from "react";
import { LogIn, Search, BookOpen } from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Login Securely",
      description:
        "Authorized personnel sign in through the secure access portal to access the DADP eLibrary system.",
      icon: LogIn,
    },
    {
      number: "02",
      title: "Browse the Library",
      description:
        "Search by title, category, or subject area to locate the required manuals, references, and learning materials.",
      icon: Search,
    },
    {
      number: "03",
      title: "Read Materials",
      description:
        "Open approved PDF resources directly within the platform or in a separate tab for easier reading.",
      icon: BookOpen,
    },
  ];

  return (
    <section id="how-it-works" className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <img src="/army logo.jpeg" alt="" className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[#163021]">
            How It Works
          </h2>
          <p className="mt-4 text-base md:text-lg leading-8 text-slate-600">
            A simple and secure process that helps personnel access internal
            reference materials quickly and efficiently.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="rounded-[28px] border border-[#d8dfd8] bg-[#F8FAF8] p-8 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-[#1F3D2B] px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-white">
                    {step.number}
                  </span>

                  <div className="h-14 w-14 rounded-2xl bg-[#E7EFE8] text-[#1F3D2B] flex items-center justify-center">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                </div>

                <h3 className="mt-8 text-2xl font-semibold text-[#163021]">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;