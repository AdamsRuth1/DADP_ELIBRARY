const defaultDadpLandingConfig = {
  navigation: {
    title: "DADP Headquarters",
    subtitle: "Directorate of Automated Data Processing",
    links: [
      { label: "Courses", href: "#courses" },
      { label: "Command", href: "#command" },
      { label: "Activities", href: "#activities" },
      { label: "Ceremonies", href: "#ceremonies" }
    ],
    ctaText: "Visit eLibrary",
    ctaLink: "/elibrary"
  },

  hero: {
    heading: "Directorate of Automated Data Processing",
    subtitle: "Pioneering automated systems, cybersecurity, and digital readiness for the Nigerian Army.",
    primaryText: "Visit eLibrary",
    primaryHref: "/elibrary",
    secondaryText: "Explore Courses",
    secondaryHref: "#courses",
    imageAlt: "Technology Center",
    buttonPrimaryId: "elibrary-cta"
  },

  leadership: {
    sectionLabel: "Leadership & Vision",
    header: "Commander and Director Spotlight",
    commander: {
      name: "MAJ GEN KO OSEMWEGIE",
      rank: "DSS psc(+)fdc(+)FCM MNIM PhD",
      role: "Commander, Nigeria Army CyberWarfare Command (NACWC)",
      vision: "To defend the Nigeria Army's cyberspace, attack and neutralize hostile digital threats, and exploit cyber capabilities to safeguard national interests, support land operations, and accomplish tasks in aid of civil authority."
    },
    director: {
      name: "BRIG GEN VE CLETUS",
      rank: "DSS FCM psc fdc MNIM MSPSP MSC",
      role: "Director, Directorate Of Automated Data Processing (DADP)",
      overview: "Established in 1983, the Directorate of Automated Data Processing (DADP) was forged to primarily advise the Chief of Army Staff (COAS) on all critical matters concerning ICT, data automation, and Management Information Systems within the Nigerian Army."
    }
  },

  about: {
    heading: "About The Directorate",
    subheading: "Established in 1983, the Directorate of Automated Data Processing (DADP) was forged to primarily advise the Chief of Army Staff (COAS) through the COA(A) on all critical matters concerning ICT and data automation within the Nigerian Army.",
    roles: [
      { title: "Strategic Policy Formulation", desc: "Advising the COAS on modernizing and formulating policies for robust Management Information Systems (MIS)." },
      { title: "Data Automation & Storage", desc: "Collection, collation, secure storage, and real-time updating of all Nigerian Army personnel records." },
      { title: "Advanced ICT Training", desc: "Executing AHQ-approved advanced ICT courses for the NA and other sister service combatants." },
      { title: "Infrastructure Maintenance", desc: "Sustaining operational readiness through expert repair and maintenance of tactical computers and networking equipment." },
      { title: "Specialized Technical Support", desc: "Providing crucial tier-level support to AHQ MS(A), AWHL, HQ CAR, NAWIS, and DATI." },
      { title: "Competency Development", desc: "Spearheading the aggressive development of competencies in global military networking and software engineering." }
    ],
    departments: {
      heading: "Organizational Structure",
      description: "The DADP is structurally organized into 4 distinct departments: Training, Documentation, ADP, and Research & Development (R&D). Operations are currently spearheaded by our elite Training and Documentation wings.",
      cards: [
        { title: "Training Department", desc: "Saddled with the immense responsibility of executing AHQ-approved advanced ICT tactical application courses.", bullets: ["Collaboration and active liaison with renowned global IT firms on the latest tech trends.", "Execution of Supervised Industrial Work Experience Scheme (SIWES) and On-the-Job-Training (OJT).", "Creation of advanced workstations and strategic competency development for system cloning.", "Continuous evaluation and revaluation of trending military IT applications."] },
        { title: "Documentation Dept. (Data Centre)", desc: "The operational lung of NA personnel data tracking. This crucial unit handles massive datasets securely.", bullets: ["Responsible for meticulously capturing, collating, and securely updating all NA personnel data.", "Processes strategic data flows heavily from formations and units across the national theatre.", "Synchronizes intelligently with relevant AHQ departments to maintain absolute data integrity regarding varied military occurrences."] }
      ]
    }
  },

  command: {
    heading: "Command & Leadership",
    description: "The strategic visionaries guiding the Directorate of Automated Data Processing towards cyber excellence.",
    cards: [
      { title: "Maj General CU UNWUNLE DSS psc fdc cm FCM MSc MNIM", subtitle: "21 DEC 21 TO 31 JAN 22" },
      { title: "BRIG GEN EO AGBEBAKU DSS FCM psc", subtitle: "31 JAN 22 TO 15 FEB 23" },
      { title: "BRIG GEN AA NGURU mni psc FNARC DSS", subtitle: "15 JAN 23 TO 14 OCT 24" },
      { title: "COL KJ NWACHYKWU MSS FCM psc fwc M TECH MSC MISN MCPH", subtitle: "14 OCT 24 TO 28 FEB 25" },
      { title: "BRIG GEN VE CLETUS DSS FCM psc fdc MNIM MCPN mspsp MSC", subtitle: "28 FEB 25 — PRESENT" }
    ],
    staffIntro: "DADP Key Operational Staff",
    staffRoles: [
      { role: "Chief Logistics Officer", desc: "Oversees hardware procurement and lab integrity." },
      { role: "Head of Curriculum", desc: "Ensures technical syllabus aligns with modern standards." },
      { role: "Network Administrator Base", desc: "Maintains zero-latency environment for internal systems." },
      { role: "Student Affairs Officer", desc: "Manages housing, welfare, and student operational readiness." }
    ]
  },

  courses: {
    heading: "Academic Training Quarters",
    subheading: "Our rigorous courses are divided into highly focused strategic quarters designed to systematically upgrade personnel capabilities.",
    quarters: [
      {
        q: "1st Quarter",
        time: "January — April",
        color: "border-blue-500",
        courses: ["System Administration and Maintenance", "Database Security and Information Assurance"],
        syllabus: [
          { title: "System Administration & Maintenance", topics: ["SAM 101 Hardware and software configuration and Maintenance", "SAM 102 Managing Users and Windows Registry", "SAM 104 Computer Security", "SAM 104 Data Recovery/Hard disk Management", "SAM 105 Windows Server", "SAM 106 Introduction to Basic Unmanned Aerial Vehicle", "SAM 107 Advanced Excel", "SAM 108 Map Reading", "SAM 109 Improvised Explosive Device", "SAM 110 Introduction to Artificial Intelligence", "SAM 111 NA Ethic Custom and Tradition", "SAM 112 NA Doctrine"] },
          { title: "Database Security & Info Assurance", topics: ["DSIA 101 Network Design Techniques", "DSIA 102 Ethical Hacking", "DSIA 103 Database Security", "DSIA 104 Digital Forensic", "DSIA 105 Closed Circuit Television Installation and Configuration", "DSIA 106 Introduction to Basic Unmanned Aerial Vehicle", "DSIA 107 Advanced Excel", "DSIA 108 Map Reading", "DSIA 109 Improvised Explosive Device", "DSIA 110 Introduction to Artificial Intelligence", "DSIA 111 NA Ethic Custom and Tradition", "DSIA 112 NA Doctrine"] }
        ]
      },
      {
        q: "2nd Quarter",
        time: "April — July",
        color: "border-green-500",
        courses: ["Database Management System", "Information Management System"],
        syllabus: [
          { title: "Database Management System", topics: ["Relational Database Architecture", "Advanced SQL & Query Optimization", "Data Redundancy & Backups", "Performance Tuning"] },
          { title: "Information Management System", topics: ["Data Collection & Processing Protocols", "Enterprise Information Architecture", "Disaster Recovery Operations", "Strategic Data Analysis"] }
        ]
      },
      {
        q: "3rd Quarter",
        time: "July — September",
        color: "border-yellow-500",
        courses: ["Microsoft Office Proficiency for NA Clerks"],
        syllabus: [
          { title: "Microsoft Office Proficiency", topics: ["Advanced Excel Data Processing & Macros", "Professional Documentation & Formats", "PowerPoint Briefing Construction", "Digital Workflow Automation"] }
        ]
      },
      {
        q: "4th Quarter",
        time: "September — December",
        color: "border-purple-500",
        courses: ["Database Management using Oracle and Access", "Satellite Internet Automated Data Processing"],
        syllabus: [
          { title: "Oracle & Access Database Management", topics: ["PL/SQL Engineering", "Access Database Scaling", "Oracle Cloud Infrastructure", "Secure Network Migrations"] },
          { title: "Satellite Internet ADP", topics: ["Satellite Uplink Configurations", "Automated Target Data Processing", "Remote Network Deployments", "Field Communications Systems"] }
        ]
      }
    ]
  },

  instructors: {
    heading: "Elite Dedicated Instructors",
    description: "Our faculty consists of battle-hardened cyber engineers and seasoned database administrators. Their dedication to teaching ensures that every student graduates with unshakeable competence.",
    highlight: "We don't just teach theory. Our instructors physically walk students through grueling live network architectures, ensuring quality education and tactical intuition.",
    team: [
      { name: "WO S. ADEBOWALE", role: "CSE COORD", desc: "Ethical Hacking, digital forensic and Advanced Excel", imgKey: "Cordinator" },
      { name: "WO J. ABUE", role: "", desc: "Dedicated to forging the next generation of threat analysts.", imgKey: "Image1" },
      { name: "WO SO. DUROJAIYE", role: "CSM", desc: "AI.", imgKey: "Image4" },
      { name: "SSGT S. NDAM", role: "INSTRUCTOR", desc: "CCTV.", imgKey: "Image2" },
      { name: "WO A. MORUFU", role: "INSTRUCTOR", desc: "MAP READING.", imgKey: "Image3" },
      { name: "SGT I. FELIX", role: "INSTRUCTOR", desc: "DRONE AND DATABASE.", imgKey: "Image4" }
    ]
  },

  events: {
    heading: "Latest DADP Activities",
    events: [
      { title: "GOC Visit", description: "Senior leadership inspected our training centre and met with cadets to reinforce DADP‘s readiness mission.", imageKey: "GOCVisitImage" },
      { title: "ICT Exam", description: "Competency-based testing for cyber and systems students with strong emphasis on security fundamentals.", imageKey: "ICTExam" },
      { title: "New Student Inauguration", description: "Welcoming fresh recruits and introducing them to the core values of the Directorate.", imageKey: "InaugurationImage" },
      { title: "IED Detection Practical", description: "Hands-on practical exercise focused on identifying improvised explosive devices and threat indicators.", imageKey: "PracticalImage" }
    ]
  },

  partnerships: {
    heading: "Strategic ICT Partnerships",
    description: "DADP operates at the apex of military technology and allied educational partnerships to advance nation-wide cyber capability.",
    partners: [
      { name: "LASU", role: "Infrastructure Partner", imgKey: "Lasu" }
    ]
  },

  activities: {
    heading: "World-Class Study Environment",
    highlight: "24/7 Unrestricted High-Speed Internet",
    highlightDetails: "All students are granted round-the-clock free internet access within our heavily optimized, air-conditioned study environments. We ensure every operational resource is available uninterrupted to guarantee proper learning retention.",
    body: "Our classroom engagements prioritize immersive, hands-on practical activities over raw theory. Instructors force students into intense simulations to tackle real-life operational scenarios on live networks.",
    list: ["Intense Hands-On Practical Activities", "Real-time Threat Simulation Scenarios", "Collaborative Operations Tactics", "Hardware Assembly & Server Racking"]
  },

  campusLife: {
    heading: "Student Welfare & Premium Infrastructure",
    subheading: "Creating a healthy, high-performance ecosystem for our student defenders with top-tier utilities and healthy recreation.",
    facilities: [
      {
        title: "Evening Games & Sports Recreation",
        description: "Fostering team cohesion, physical stamina, and mental wellness. DADP provides premium sporting facilities and diverse outdoor/indoor recreational games for students to unwind after intensive cyber operations training.",
        tag: "Recreation & Wellness"
      },
      {
        title: "24/7 Uninterrupted Hybrid Power Supply",
        description: "Zero latency, zero downtime. Powered by clean hybrid solar installations and high-capacity silent standby generators, DADP ensures round-the-clock electric power supply to all laboratories, lecture theatres, and student hostels.",
        tag: "Operational Infrastructure"
      },
      {
        title: "Advanced Water Purification Systems",
        description: "Promoting student health and safety. Equipped with professional multi-stage water filtration and industrial purification machines, guaranteeing clean, safe, and healthy drinking and cooking water daily.",
        tag: "Health & Hygiene"
      }
    ]
  },

  ceremonies: {
    heading: "Graduation & Ceremonies",
    description: "Recognizing the dedication and mastery of our graduating professionals.",
    slides: [
      { title: "Celebrating Excellence", subtitle: "Recognizing the dedication and mastery of our graduating professionals" },
      { title: "Honoring Achievement", subtitle: "Ceremonies that reflect our commitment to elite training and service." },
      { title: "Celebrating Excellence", subtitle: "Moments that define the next generation of digital defenders." }
    ]
  }
};

export default defaultDadpLandingConfig;
