import React from "react";
import {
  Shield,
  Wrench,
  BookOpen,
  Briefcase,
  FileText,
  GraduationCap,
} from "lucide-react";

function LibraryCategories() {
  const categories = [
    {
      title: "Strategy",
      description:
        "Doctrine, planning frameworks, and military strategy reference materials.",
      icon: Shield,
    },
    {
      title: "Engineering",
      description:
        "Technical manuals, field engineering references, and equipment guides.",
      icon: Wrench,
    },
    {
      title: "Leadership",
      description:
        "Command, administration, leadership development, and management resources.",
      icon: GraduationCap,
    },
    {
      title: "Operations",
      description:
        "Operational procedures, mission support documents, and field references.",
      icon: Briefcase,
    },
    {
      title: "Training Manuals",
      description:
        "Instructional documents and structured materials for learning and development.",
      icon: FileText,
    },
    {
      title: "General Reference",
      description:
        "Approved supporting materials for broader institutional and professional use.",
      icon: BookOpen,
    },
  ];

  return (
    <section id="categories" className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <img src="/army logo.jpeg" alt="" className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[#163021]">
            Library Categories
          </h2>
          <p className="mt-4 text-base md:text-lg leading-8 text-slate-600">
            Materials are organized into clear categories to help personnel find
            the right resources quickly and with minimal effort.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <article
                key={category.title}
                className="rounded-[28px] border border-[#d8dfd8] bg-[#F8FAF8] p-8 shadow-sm transition hover:shadow-md"
              >
                <div className="h-14 w-14 rounded-2xl bg-[#1F3D2B] text-[#C5A64D] flex items-center justify-center">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-[#163021]">
                  {category.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {category.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LibraryCategories;