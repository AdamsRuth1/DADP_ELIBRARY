import React, { useState } from "react";

const quarters = [
  {
    q: "1st Quarter", time: "January — April", color: "border-blue-500",
    courses: ["System Administration and Maintenance", "Database Security and Information Assurance"],
    syllabus: [
      { title: "System Administration & Maintenance", topics: ["SAM 101 Hardware and sofware configuration and Maintenance", "SAM 102 Managing Users and Window Registry", "SAM 104 Computer Security", "SAM 104 Data Recovery/Hard disk Management", "SAM 105 Windows Server", "SAM 106 Introduction to Basic Unmanned Aerial Vehicle", "SAM 107 Advanced Excel", "SAM 108 Map Reading ", "SAM 109 Improvised Explosive Device", "SAM 110 Introduction to Artificial intelligence", "SAM 111 NA Ethic Custom and Tradition", "SAM 112 NA Doctrine"] },
      { title: "Database Security & Info Assurance", topics: ["DSIA 101 Network Design Techniques", "DSIA 102 Ethical Hacking", "DSIA 103 DataBase Security", "DSIA 104 Digital Forensic", "DSIA 105 Closed Circuit Television Installation and Configuration", "DSIA 106 Introduction to Basic Unmanned Aerial Vehicle", "DSIA 107 Advance Excel", "DSIA 108 Map Reading ", "DSIA 109 Improvised Explosive Device", "DSIA 110 Introduction to Artificial intelligence", "DSIA 111 NA Ethic Custom and Tradition", "DSIA 112 NA Doctrine"] }
    ]
  },
  {
    q: "2nd Quarter", time: "April — July", color: "border-green-500",
    courses: ["Database Management System", "Information Management System"],
    syllabus: [
      { title: "Database Management System", topics: ["Relational Database Architecture", "Advanced SQL & Query Optimization", "Data Redundancy & Backups", "Performance Tuning"] },
      { title: "Information Management System", topics: ["Data Collection & Processing Protocols", "Enterprise Information Architecture", "Disaster Recovery Operations", "Strategic Data Analysis"] }
    ]
  },
  {
    q: "3rd Quarter", time: "July — September", color: "border-yellow-500",
    courses: ["Microsoft Office Proficiency for NA Clerks"],
    syllabus: [
      { title: "Microsoft Office Proficiency", topics: ["Advanced Excel Data Processing & Macros", "Professional Documentation & Formats", "PowerPoint Briefing Construction", "Digital Workflow Automation"] }
    ]
  },
  {
    q: "4th Quarter", time: "September — December", color: "border-purple-500",
    courses: ["Database Management using Oracle and Access", "Satellite Internet Automated Data Processing"],
    syllabus: [
      { title: "Oracle & Access Database Management", topics: ["PL/SQL Engineering", "Access Database Scaling", "Oracle Cloud Infrastructure", "Secure Network Migrations"] },
      { title: "Satellite Internet ADP", topics: ["Satellite Uplink Configurations", "Automated Target Data Processing", "Remote Network Deployments", "Field Communications Systems"] }
    ]
  },
];

export default function DadpCourses() {
  const [activeSyllabus, setActiveSyllabus] = useState(null);

  return (
    <>
      <section className="bg-[#F5F6F4]/90 backdrop-blur-md py-20" id="courses">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1F3D2B] mb-4">Academic Training Quarters</h2>
            <div className="w-24 h-1.5 bg-[#C5A64D] mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
              Our rigorous courses are divided into highly focused strategic quarters designed to systematically upgrade personnel capabilities.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {quarters.map((quarter, idx) => (
              <div key={idx} className={`bg-white rounded-2xl shadow-lg border-t-8 ${quarter.color} p-6 flex flex-col h-full transform hover:-translate-y-2 transition-transform duration-300`}>
                <div className="mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-2xl font-black text-gray-900">{quarter.q}</h3>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">{quarter.time}</p>
                </div>
                <div className="flex-1">
                  <ul className="space-y-4">
                    {quarter.courses.map((c, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 bg-[#1F3D2B]/10 p-1 rounded-full text-[#1F3D2B]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span className="font-semibold text-gray-800 leading-snug">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => setActiveSyllabus(quarter)}
                  className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  View Syllabus
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Syllabi Modal tightly encapsulated within the component */}
      {activeSyllabus && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative border-t-8 border-[#C5A64D]">

            <div className="sticky top-0 bg-slate-900 text-white p-6 md:p-8 rounded-t-2xl z-10 box-border border-b border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">{activeSyllabus.q} Syllabus</h2>
                <p className="text-[#C5A64D] font-bold text-sm tracking-widest">{activeSyllabus.time}</p>
              </div>
              <button
                onClick={() => setActiveSyllabus(null)}
                className="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-10">
              {activeSyllabus.syllabus.map((courseSyllabus, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center font-bold">{index + 1}</span>
                    <h3 className="text-xl font-bold text-gray-900">{courseSyllabus.title}</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 pl-11">
                    {courseSyllabus.topics.map((topic, tidx) => (
                      <div key={tidx} className="bg-slate-50 border border-gray-100 p-4 rounded-xl flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
                        <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700 font-medium">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-100 bg-slate-50 rounded-b-3xl">
              <button onClick={() => setActiveSyllabus(null)} className="w-full py-4 text-center font-bold bg-[#1F3D2B] hover:bg-[#15291d] text-white rounded-xl transition-all">
                Acknowledge and Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
