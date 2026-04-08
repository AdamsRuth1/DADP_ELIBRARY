import React from "react";
import { ShieldCheck, BookOpen, Users, Settings } from "lucide-react";

function CoreResponsibility() {
  const items = [
    {
      title: "Secure Access",
      description:
        "Ensure only authorized personnel can access internal documents and resources.",
      icon: ShieldCheck,
    },
    {
      title: "Knowledge Management",
      description:
        "Maintain organized digital resources for easy retrieval and long-term use.",
      icon: BookOpen,
    },
    {
      title: "User Support",
      description:
        "Provide reliable access and usability for all personnel across the system.",
      icon: Users,
    },
    {
      title: "System Administration",
      description:
        "Manage content, updates, and operational control of the eLibrary platform.",
      icon: Settings,
    },
  ];

  return (
    <section className="bg-[#F5F6F4] py-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F3D2B]">
            Core Responsibilities
          </h2>
          <p className="mt-4 text-gray-600">
            Key functional areas of the DADP eLibrary system
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-[#E5E4E2] rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-[#1F3D2B] text-[#C5A64D] rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="mt-4 text-lg font-semibold text-[#1F3D2B]">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default CoreResponsibility;