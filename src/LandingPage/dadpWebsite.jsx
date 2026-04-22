import React, { useState, useEffect } from "react";
import Logo from "../assets/cyberwarfareLogo.png";

// Placeholder images for the sections
const PREVIEW_IMG = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
const CLASSROOM_1 = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const CLASSROOM_2 = "https://images.unsplash.com/photo-1531482615713-2def6ce27a93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const CLASSROOM_3 = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const CLASSROOM_4 = "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const CLASSROOM_5 = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const CLASSROOM_6 = "https://images.unsplash.com/photo-1571260899304-425dea4cf36e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const CEREMONY_1 = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
const CEREMONY_2 = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
const CEREMONY_3 = "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

function DadpWebsite() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const ceremonies = [CEREMONY_1, CEREMONY_2, CEREMONY_3];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ceremonies.length);
    }, 3500); // Transition every 3.5 seconds
    return () => clearInterval(timer);
  }, [ceremonies.length]);

  return (
    <div className="relative bg-[#F5F6F4] min-h-screen text-slate-900 font-sans">
      {/* Background Army Watermark Layer */}
      <div className="army-watermark"></div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Simple navigation for the DADP Main Site */}
        <header className="sticky top-0 z-50 bg-green-900 border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={Logo}
                  alt="DADP logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">DADP Headquarters</h1>
                <p className="text-xs text-white">Department of Automated Data Processing</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-white">
              <a href="#courses" className="text-sm font-medium hover:text-[#C5A64D]">Courses</a>
              <a href="#chronicles" className="text-sm font-medium hover:text-[#C5A64D]">Command</a>
              <a href="#activities" className="text-sm font-medium hover:text-[#C5A64D]">Activities</a>
              <a href="#ceremonies" className="text-sm font-medium hover:text-[#C5A64D]">Ceremonies</a>
            </nav>

            <div className="hidden md:block">
              <a
                href="/elibrary"
                className="bg-[#C5A64D] text-[#1F3D2B] px-5 py-2 rounded-xl font-semibold hover:bg-[#d4b45a]"
              >
                Visit eLibrary
              </a>
            </div>
          </div>
        </header>

        {/* SECTION 1: WHAT DADP REPRESENTS (HERO) */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-24" id="home">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="backdrop-blur-sm bg-white/40 p-8 rounded-3xl border border-white/50 shadow-xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F3D2B] leading-tight mb-4">
                Department of Automated Data Processing (DADP)
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed font-medium">
                Pioneering the digital frontier and ensuring operational readiness.
                DADP stands at the forefront of automated systems, cyber security,
                and software engineering—equipping our personnel with the cutting-edge
                technical skills required to lead in a modern, data-driven environment.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/elibrary"
                  className="bg-[#1F3D2B] hover:bg-[#162c1f] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#1F3D2B]/30"
                >
                  Visit our eLibrary
                </a>
                <a
                  href="#courses"
                  className="border-2 border-[#1F3D2B] bg-transparent text-[#1F3D2B] hover:bg-[#1F3D2B] hover:text-white px-8 py-3 rounded-xl font-bold transition-all"
                >
                  Explore Courses
                </a>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-[#C5A64D] rounded-3xl opacity-20 blur-3xl transform rotate-6"></div>
              <img
                src={PREVIEW_IMG}
                alt="Technology Center"
                className="relative z-10 w-full max-w-lg rounded-2xl shadow-2xl object-cover h-[400px] border-4 border-white"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: COURSES OFFERED (6 Courses) */}
        <section className="bg-white/80 backdrop-blur-md py-20" id="courses">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F3D2B] mb-4">Courses Offered</h2>
              <div className="w-24 h-1.5 bg-[#C5A64D] mx-auto rounded-full"></div>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Comprehensive training programs designed to forge technical experts in various IT domains.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "System Administration and Maintenance", desc: "Comprehensive training on managing enterprise IT environments, server configuration, and proactive hardware maintenance to ensure maximum uptime." },
                { title: "Database Security and Information Assurance", desc: "Advanced strategies for protecting sensitive data, implementing robust access controls, and ensuring regulatory compliance across database systems." },
                { title: "Database Management System", desc: "In-depth exploration of database architecture, query optimization, and the efficient storage and retrieval of organizational data." },
                { title: "Information Management System", desc: "Designing and deploying interconnected systems that collect, process, and analyze data to support strategic decision-making and optimal operations." },
                { title: "Microsoft Office Proficiency", desc: "Mastery of essential productivity tools including Word, Excel, and PowerPoint to streamline administrative workflows, documentation, and data analysis." },
                { title: "Database Management using Oracle and Access", desc: "Specialized practical instruction focused on building, migrating, and querying complex relational databases utilizing Oracle and Microsoft Access platforms." },
              ].map((course, idx) => (
                <div key={idx} className="group p-8 rounded-2xl bg-slate-50 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-[#C5A64D]/20 flex items-center justify-center text-[#C5A64D] mb-6">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1F3D2B] mb-3">{course.title}</h3>
                  <p className="text-gray-600">{course.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: CHRONICLES OF COMMAND */}
        <section className="max-w-7xl mx-auto px-6 py-20" id="chronicles">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F3D2B] mb-4">Chronicles of Command</h2>
            <div className="w-24 h-1.5 bg-[#C5A64D] mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Honoring the distinguished commanders who have led the Department of Automated Data Processing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="bg-white p-6 rounded-2xl shadow-md text-center border-t-4 border-[#1F3D2B]">
                <div className="w-24 h-24 mx-auto rounded-full bg-slate-200 border-4 border-white shadow-lg overflow-hidden mb-4">
                  <img src={PREVIEW_IMG} alt="Commander placeholder" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Commander Name {num}</h3>
                <p className="text-[#C5A64D] font-medium text-sm">202{num} - Present</p>
                <p className="text-gray-500 text-xs mt-2 italic">Excellence in Leadership</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: CLASSROOM ACTIVITIES */}
        <section className="bg-slate-900 text-white py-20" id="activities">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Classroom Activities</h2>
                <div className="w-24 h-1.5 bg-[#C5A64D] rounded-full mb-6"></div>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  Our classroom environments are highly interactive, blending theoretical instruction with intensive hands-on practical labs. Students engage in live network simulations, code reviews, and problem-solving exercises tailored to real-world operational challenges.
                </p>
                <ul className="space-y-3">
                  {['Interactive Lab Sessions', 'Real-time Threat Simulation', 'Collaborative Coding', 'Hardware Assembly Workshops'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-200">
                      <svg className="w-5 h-5 text-[#C5A64D]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <img src={CLASSROOM_1} alt="Classroom 1" className="rounded-xl object-cover h-32 w-full shadow-lg" />
                <img src={CLASSROOM_2} alt="Classroom 2" className="rounded-xl object-cover h-40 w-full shadow-lg translate-y-4" />
                <img src={CLASSROOM_3} alt="Classroom 3" className="rounded-xl object-cover h-32 w-full shadow-lg" />
                <img src={CLASSROOM_4} alt="Classroom 4" className="rounded-xl object-cover h-40 w-full shadow-lg -translate-y-4 sm:translate-y-8" />
                <img src={CLASSROOM_5} alt="Classroom 5" className="rounded-xl object-cover h-32 w-full shadow-lg translate-y-2 sm:-translate-y-0" />
                <img src={CLASSROOM_6} alt="Classroom 6" className="rounded-xl object-cover h-40 w-full shadow-lg translate-y-6 sm:translate-y-12" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: GRADUATION CEREMONIES (Carousel) */}
        <section className="py-20" id="ceremonies">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F3D2B] mb-4">Graduation & Ceremonies</h2>
              <div className="w-24 h-1.5 bg-[#C5A64D] mx-auto rounded-full"></div>
            </div>

            <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-black">
              {ceremonies.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <img src={imgSrc} alt={`Ceremony ${idx + 1}`} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
                    <div className="p-8 md:p-12 w-full text-center">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Celebrating Excellence</h3>
                      <p className="text-gray-200">Recognizing the dedication and mastery of our graduating professionals</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {ceremonies.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${currentSlide === idx ? 'bg-[#C5A64D] scale-125' : 'bg-white/50'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-gray-400 py-8 text-center text-sm border-t border-gray-800">
          <p>&copy; {new Date().getFullYear()} Department of Automated Data Processing (DADP). All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default DadpWebsite;
