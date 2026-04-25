import React, { useState, useEffect } from "react";

const PREVIEW_IMG = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
const CLASSROOM_3 = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
const CLASSROOM_5 = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";

const instructors = [
  { name: "Major J. Abubakar", role: "Lead Systems Architect", desc: "Expert in scalable enterprise administration.", img: PREVIEW_IMG },
  { name: "Capt S. Ojo", role: "Cyber Security Analyst", desc: "Dedicated to forging the next generation of threat analysts.", img: CLASSROOM_3 },
  { name: "Lt E. Nwosu", role: "Database Admin Instructor", desc: "Passionate about robust Oracle and MSSQL integrations.", img: CLASSROOM_5 }
];

export default function DadpInstructors() {
  const [currentInstructor, setCurrentInstructor] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentInstructor((prev) => (prev + 1) % instructors.length);
    }, 4500); 
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-emerald-950 text-white overflow-hidden relative">
       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-fixed opacity-10 mix-blend-overlay"></div>
       <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
         <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Elite Dedicated Instructors</h2>
            <div className="w-24 h-1.5 bg-[#C5A64D] rounded-full mb-8"></div>
            <p className="text-lg text-emerald-100/80 leading-relaxed mb-6">
              Our faculty consists of battle-hardened cyber engineers and seasoned database administrators. Their dedication to teaching ensures that every student graduates with unshakeable competence.
            </p>
            <p className="text-lg text-emerald-100/80 leading-relaxed">
              We don't just teach theory. Our instructors physically walk students through grueling live network architectures, ensuring quality education and tactical intuition.
            </p>
         </div>
         <div className="relative h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-800/50">
           {instructors.map((inst, idx) => (
             <div key={idx} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${currentInstructor === idx ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
               <img src={inst.img} alt={inst.name} className="w-full h-full object-cover" />
               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8">
                 <h4 className="text-2xl font-bold text-white">{inst.name}</h4>
                 <p className="text-[#C5A64D] font-bold text-sm uppercase tracking-wider mb-2">{inst.role}</p>
                 <p className="text-gray-300 italic">"{inst.desc}"</p>
               </div>
             </div>
           ))}
         </div>
       </div>
    </section>
  );
}
