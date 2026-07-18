import React, { useState, useMemo, useRef } from 'react';

const TRACKS = {
  ai: {
    label: 'AI',
    foundation: {
      skills: ['Python basics', 'Linear algebra for AI', 'Probability & statistics', 'Problem-solving mindset'],
      tools: ['Jupyter notebooks', 'NumPy & Pandas'],
      projects: ['Build a simple classifier demo', 'Explore a public dataset with notebook analysis'],
    },
    core: {
      skills: ['Neural networks fundamentals', 'Model training and evaluation', 'Deep learning intuition', 'Bias, variance and interpretability'],
      tools: ['Scikit-learn', 'PyTorch or TensorFlow', 'Google Colab/Kaggle'],
      projects: ['Train a small vision or NLP model', 'Present an AI project story end-to-end'],
    },
    jobNote: 'AI interviews usually test how clearly you can explain your model choice and the trade-offs behind it.',
  },
  ml: {
    label: 'Machine Learning',
    foundation: {
      skills: ['Python fundamentals', 'Statistics and probability', 'Linear algebra basics', 'SQL for data exploration'],
      tools: ['Jupyter notebooks', 'NumPy, Pandas & Matplotlib'],
      projects: ['EDA on a public dataset', 'A simple prediction model'],
    },
    core: {
      skills: ['Regression and classification', 'Feature engineering', 'Model evaluation', 'Intro to deep learning'],
      tools: ['Scikit-learn', 'XGBoost or LightGBM', 'An ML notebook environment'],
      projects: ['A deployable mini ML app', 'A notebook pipeline with clean metrics and explanation'],
    },
    jobNote: 'Be ready to explain the data, model choice, and why your evaluation mattered — not only the final accuracy.',
  },
  ds: {
    label: 'Data Science',
    foundation: {
      skills: ['Python fundamentals', 'Statistics & probability', 'SQL querying', 'Data visualization basics'],
      tools: ['Jupyter notebooks', 'Pandas & Seaborn'],
      projects: ['Clean and explore a public dataset', 'Create a dashboard-style analysis narrative'],
    },
    core: {
      skills: ['Business problem framing', 'Feature engineering', 'A/B-style thinking', 'Visualization storytelling'],
      tools: ['Power BI or Tableau', 'Scikit-learn', 'GitHub for project documentation'],
      projects: ['An end-to-end data analysis project', 'A small deployment or dashboard with insights'],
    },
    jobNote: 'Data science hiring often values structured thinking and storytelling as much as model performance.',
  },
  web: {
    label: 'Full Stack Web Development',
    foundation: {
      skills: ['HTML, CSS and JavaScript fundamentals', 'Git & GitHub basics', 'Basic data structures & algorithms in one language'],
      tools: ['VS Code + browser dev tools', 'A GitHub account with your first commits'],
      projects: ['A static personal portfolio site', 'A small JS project (to-do list, calculator)'],
    },
    core: {
      skills: ['A frontend framework (React is the safest default)', 'Node.js & Express for backend basics', 'REST APIs and how the frontend talks to the backend', 'SQL plus one NoSQL database'],
      tools: ['A deployment platform (Vercel/Netlify/Render or similar)', 'Postman or similar for testing APIs'],
      projects: ['A full-stack CRUD app (e.g. a notes app or small e-commerce site)', 'A dashboard that consumes a public API', 'Contribute a small fix to an open-source repo'],
    },
    jobNote: 'Practice DSA in whichever language you are most fluent in — most product companies test this regardless of your stack.',
  },
  cyber: {
    label: 'Cyber Security',
    foundation: {
      skills: ['Networking fundamentals (TCP/IP, DNS, HTTP)', 'Linux basics', 'Python or C basics', 'Operating systems concepts'],
      tools: ['A Linux VM (Kali or similar) for practice', 'Wireshark for packet inspection'],
      projects: ['Set up a home lab with a vulnerable VM to practice on', 'Basic network scanning exercises in a legal, sandboxed environment'],
    },
    core: {
      skills: ['Web application security (OWASP Top 10)', 'Basic cryptography concepts', 'Network security tools & firewalls', 'Ethical hacking fundamentals'],
      tools: ['Burp Suite Community Edition', 'A CTF platform (TryHackMe/HackTheBox or similar)'],
      projects: ['Participate in beginner-friendly CTFs', 'A documented vulnerability assessment of a deliberately vulnerable app', 'Write up your CTF solutions publicly (blog/GitHub)'],
    },
    jobNote: 'Be ready to walk an interviewer through a CTF writeup or a vulnerability you found — it is usually your strongest interview story.',
  },
  cloud: {
    label: 'Cloud & DevOps',
    foundation: {
      skills: ['Linux fundamentals', 'Networking basics', 'A scripting language (Python or Bash)', 'Git & GitHub basics'],
      tools: ['A free-tier account on AWS, Azure or GCP', 'VS Code + terminal'],
      projects: ['Host a static website on a free-tier cloud service', 'Write shell scripts to automate a repetitive task'],
    },
    core: {
      skills: ['Core services of one cloud provider (compute, storage, networking)', 'Docker & containerization basics', 'CI/CD fundamentals', 'Infrastructure as Code basics (Terraform)'],
      tools: ['Docker Desktop', 'GitHub Actions or Jenkins for CI/CD', 'Terraform or a similar IaC tool'],
      projects: ['Containerize an existing app with Docker', 'Set up a CI/CD pipeline for a personal project', 'Deploy a small app on a local Kubernetes cluster (e.g. minikube)'],
    },
    jobNote: 'Cloud/DevOps interviews often include scenario questions ("how would you scale this?") — practice explaining trade-offs, not just tool names.',
  },
  java: {
    label: 'Java',
    foundation: {
      skills: ['Java syntax and OOP', 'Collections and exception handling', 'Java I/O & packages', 'Basic data structures'],
      tools: ['IntelliJ IDEA or Eclipse', 'Git & GitHub'],
      projects: ['Build a small console app', 'Create a mini CRUD project'],
    },
    core: {
      skills: ['Spring Boot basics', 'JDBC and REST APIs', 'Unit testing basics', 'Design patterns fundamentals'],
      tools: ['Postman', 'Maven or Gradle', 'Spring Initializr'],
      projects: ['A backend project with REST APIs', 'A mini e-commerce or task management service'],
    },
    jobNote: 'Java interviews often focus on OOP, collections, and how cleanly you explain your backend design.',
  },
  python: {
    label: 'Python',
    foundation: {
      skills: ['Python syntax', 'Functions, loops and data structures', 'File handling', 'Object-oriented programming'],
      tools: ['VS Code', 'Jupyter notebooks', 'Python package manager'],
      projects: ['A small automation script', 'A CLI task manager'],
    },
    core: {
      skills: ['Web frameworks basics', 'APIs with FastAPI or Flask', 'Pytest basics', 'Data handling with Pandas'],
      tools: ['FastAPI or Flask', 'Postman', 'GitHub'],
      projects: ['A REST API project', 'An automation or analysis tool with a clean README'],
    },
    jobNote: 'Python interviews reward clarity in logic, not just memorizing syntax — practice writing clean, explainable code.',
  },
  vlsi: {
    label: 'VLSI',
    foundation: {
      skills: ['Digital electronics & logic design', 'Basic analog electronics', 'C programming', 'Computer organization & architecture'],
      tools: ['Verilog or VHDL basics', 'Linux command line fundamentals'],
      projects: ['Simulate basic logic gates and combinational circuits', 'Build a simple calculator in C'],
    },
    core: {
      skills: ['RTL design in Verilog/SystemVerilog', 'Computer architecture (pipelining, memory hierarchy)', 'Basics of ASIC & FPGA design flow', 'Static timing analysis (STA) fundamentals'],
      tools: ['Xilinx Vivado or an equivalent FPGA toolchain', 'Python or Perl/TCL for scripting', 'A simulator (e.g. ModelSim/QuestaSim or an open alternative)'],
      projects: ['Design and simulate an ALU or a small processor in Verilog', 'Implement UART/SPI/I2C protocol modules', 'Write self-checking testbenches for your designs'],
    },
    jobNote: 'Semiconductor company written tests usually mix digital logic, Verilog coding and C — revise all three, not just one.',
  },
  embedded: {
    label: 'IoT & Embedded Systems',
    foundation: {
      skills: ['C programming (pointers & memory management especially)', 'Digital electronics basics', 'Microcontroller basics (8051/AVR/Arduino)'],
      tools: ['Arduino IDE or a similar starter toolchain', 'A basic multimeter and breadboard setup'],
      projects: ['An LED/sensor control project on Arduino', 'A simple automation project (e.g. temperature-based fan control)'],
    },
    core: {
      skills: ['ARM Cortex / STM32 programming', 'Real-time operating system (RTOS) basics', 'Embedded C at a deeper level', 'Communication protocols: UART, SPI, I2C, CAN'],
      tools: ['STM32CubeIDE or similar', 'KiCad for basic PCB design', 'A logic analyzer or oscilloscope (lab or simulated)'],
      projects: ['An IoT project (e.g. sensor data pushed to the cloud)', 'An RTOS-based multi-task project', 'A basic PCB you design and get fabricated'],
    },
    jobNote: 'Embedded interviews lean heavily on C fundamentals like pointers, structs and memory layout — do not skip this to focus only on boards.',
  },
  robotics: {
    label: 'Robotics',
    foundation: {
      skills: ['Basic electronics', 'C++ or Python for control code', 'Sensor fundamentals', 'Intro to kinematics'],
      tools: ['Arduino or Raspberry Pi', 'A simple robot chassis kit'],
      projects: ['Build a line-following robot', 'A basic obstacle-avoidance setup'],
    },
    core: {
      skills: ['ROS basics', 'Motion planning intuition', 'Motor-control fundamentals', 'Embedded robot integration'],
      tools: ['ROS2', 'Gazebo or a simulation environment', 'Microcontroller toolchain'],
      projects: ['A ROS-based robot prototype', 'A sensor fusion mini project'],
    },
    jobNote: 'Robotics interviews often reward hands-on project clarity, control understanding, and practical debugging confidence.',
  },
  app: {
    label: 'App Development',
    foundation: {
      skills: ['Kotlin (Android) or Swift (iOS) basics', 'Object-oriented programming concepts', 'Git & GitHub basics'],
      tools: ['Android Studio or Xcode', 'A GitHub account with your first commits'],
      projects: ['A simple calculator or to-do app', 'A UI clone of a screen from an app you use daily'],
    },
    core: {
      skills: ['Jetpack Compose (Android) or SwiftUI (iOS)', 'REST API integration', 'Local storage (Room/SQLite or Core Data)', 'App architecture basics (MVVM)'],
      tools: ['Firebase for backend basics (auth, database)', 'Play Console or App Store Connect familiarity'],
      projects: ['A full app with login, an API call and local storage', 'Publish a small app to internal/beta testing on the Play Store or TestFlight', 'Contribute to an open-source mobile app'],
    },
    jobNote: 'Be ready to explain your app\'s architecture — why MVVM, how data flows — not just what the app does.',
  },
  uiux: {
    label: 'UI/UX',
    foundation: {
      skills: ['Design thinking basics', 'Typography & color systems', 'User flows and wireframing', 'Basic Figma workflow'],
      tools: ['Figma', 'Notion or Miro for ideation'],
      projects: ['Redesign a common app screen', 'Create a mobile dashboard wireframe'],
    },
    core: {
      skills: ['Interaction design', 'Accessibility basics', 'Prototype testing', 'Design handoff thinking'],
      tools: ['Figma prototypes', 'User testing tools or simple interview scripts'],
      projects: ['A case-study style redesign project', 'A clickable prototype with supporting rationale'],
    },
    jobNote: 'UI/UX hiring values how well you can explain user problems, decisions, and the outcomes of your design choices.',
  },
  startup: {
    label: 'Startup & Entrepreneurship',
    foundation: {
      skills: ['Problem discovery', 'Lean canvas basics', 'Customer validation', 'Communication & storytelling'],
      tools: ['Google Docs or Notion', 'A simple landing page or pitch deck'],
      projects: ['Draft a lean canvas for a problem you care about', 'Interview 5 potential users'],
    },
    core: {
      skills: ['MVP thinking', 'Go-to-market basics', 'Pitching & fundraising fundamentals', 'User feedback loops'],
      tools: ['Canva or Google Slides', 'No-code tools to prototype quickly'],
      projects: ['Build a minimal MVP', 'Prepare a 1-minute founder pitch and a 5-slide deck'],
    },
    jobNote: 'Startup interviews look for evidence of customer focus, clarity of thought, and whether you can turn a rough idea into a tangible direction.',
  },
};

const GOAL_PHASES = {
  job: (track) => ({
    label: 'Placement Prep',
    focus: 'Get interview-ready and start applying.',
    skills: ['Revise core subjects for technical rounds', 'Aptitude & reasoning practice', 'Mock technical + HR interviews'],
    tools: ['A resume, LinkedIn and GitHub that all tell the same story', 'A track-specific interview question bank'],
    projects: ['Polish your best 1–2 projects into a clean, demo-ready walkthrough', 'Apply to internships and off-campus drives in parallel', track.jobNote],
    milestone: 'Land an internship or a full-time offer.',
  }),
  higher: () => ({
    label: 'Higher Studies Prep',
    focus: 'Build the profile and scores for MTech/MS admits.',
    skills: ['GATE prep (for MTech) or GRE/TOEFL prep (for MS)', 'Depth in one sub-area through a research-style project'],
    tools: ['A shortlist of colleges/universities matched to your track', 'SOP drafting, started early'],
    projects: ['A project substantial enough to discuss in an SOP or interview', 'Reach out to a professor about a research or internship opportunity'],
    milestone: 'Submit applications with a strong SOP, scores and recommenders lined up.',
  }),
  gate: () => ({
    label: 'Gate Preparation',
    focus: 'Build a disciplined plan for GATE-style depth, revision and problem solving.',
    skills: ['Subject-wise concept revision', 'Topic tests and mixed practice sets', 'Short revision notes and formula sheets'],
    tools: ['A standard GATE syllabus tracker', 'Previous year questions and mock papers'],
    projects: ['Create a weekly study plan for your branch-specific subjects', 'Review one topic deeply and summarize it clearly'],
    milestone: 'Improve your score confidence with a consistent revision cycle.',
  }),
  startup: () => ({
    label: 'Build & Validate',
    focus: 'Turn the skills into something people will actually use.',
    skills: ['Basic product thinking & market validation', 'Enough of the stack to ship an MVP solo or with a small team'],
    tools: ['Your college E-cell or a local incubator', 'No-code tools to move fast where things do not need to be custom'],
    projects: ['Ship an MVP and get real users to try it', 'Enter a pitch competition or apply to a student incubator'],
    milestone: 'A working MVP with real user feedback — not just an idea.',
  }),
};

const YEAR_META = {
  '1st': { mode: 'full4', labels: ['Year 1 (now)', 'Year 2', 'Year 3', 'Final Year'] },
  '2nd': { mode: 'full4', labels: ['Now – rest of Year 2', 'Year 3, first half', 'Year 3 end – Year 4 start', 'Final Year'] },
  '3rd': { mode: 'compress3', labels: ['Now – next 3 months', 'Next 3–6 months', 'Final Year'] },
  final: { mode: 'urgent2', labels: ['Next 4–6 weeks', 'Ongoing, until placed'] },
  grad: { mode: 'urgent2', labels: ['Next 4–6 weeks', 'Ongoing job search'] },
};

const YEAR_LABEL = { '1st': '1st year', '2nd': '2nd year', '3rd': '3rd year', final: 'final year', grad: 'a graduate' };
const GOAL_LABEL = { job: 'Job-ready track', higher: 'Higher-studies track', gate: 'Gate Preparation track', startup: 'Startup track' };

function buildRoadmap(trackKey, yearKey, goalKey) {
  const track = TRACKS[trackKey];
  const meta = YEAR_META[yearKey];
  const goalPhase = GOAL_PHASES[goalKey](track);
  const phases = [];

  if (meta.mode === 'full4') {
    phases.push({ label: 'Foundation', focus: `Build the base every ${track.label} engineer needs.`, ...track.foundation });
    phases.push({ label: 'Core Skills', focus: `Go from basics to job-relevant ${track.label} skills.`, ...track.core });
    phases.push({
      label: 'Projects & Practice',
      focus: 'Turn skills into a portfolio recruiters can actually look at.',
      skills: ['Pick 2–3 projects that map to real ' + track.label + ' interview questions', 'Document each project properly (README, demo, write-up)'],
      tools: ['GitHub as your project home base'],
      projects: track.core.projects,
    });
    phases.push(goalPhase);
  } else if (meta.mode === 'compress3') {
    phases.push({
      label: 'Fill the Gaps Fast',
      focus: 'Condense foundation + core into a focused sprint — you have less runway now.',
      skills: [...track.foundation.skills.slice(0, 2), ...track.core.skills.slice(0, 3)],
      tools: [...track.core.tools],
      projects: [track.foundation.projects[0]],
    });
    phases.push({
      label: 'Projects & Practice',
      focus: 'Build the 2 projects that will actually come up in interviews.',
      skills: ['Prioritize depth over breadth — 2 strong projects beat 5 shallow ones'],
      tools: ['GitHub as your project home base'],
      projects: track.core.projects,
    });
    phases.push(goalPhase);
  } else {
    phases.push({
      label: 'Fill the Gaps Fast',
      focus: 'A condensed sprint through the essentials — prioritize what interviews actually test.',
      skills: [...track.core.skills.slice(0, 3)],
      tools: [...track.core.tools.slice(0, 2)],
      projects: [track.core.projects[0]],
    });
    phases.push(goalPhase);
  }

  return phases.map((phase, index) => ({ ...phase, time: meta.labels[index] }));
}

function Eyebrow({ children }) {
  return <span className="badge rounded-pill bg-light text-warning border border-warning-subtle fw-semibold px-3 py-2">{children}</span>;
}

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      className={`btn btn-sm rounded-pill px-3 py-2 ${active ? 'btn-warning text-dark fw-semibold' : 'btn-outline-secondary'}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="mb-4">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 mb-2 display-6 fw-semibold text-dark">{title}</h2>
      {sub && <p className="text-secondary mb-0">{sub}</p>}
    </div>
  );
}

export default function App() {
  const [name, setName] = useState('');
  const [year, setYear] = useState(null);
  const [track, setTrack] = useState(null);
  const [goal, setGoal] = useState(null);
  const [formError, setFormError] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [progressByRoadmap, setProgressByRoadmap] = useState({});
  const [copyState, setCopyState] = useState('idle');

  const resultRef = useRef(null);
  const whyRef = useRef(null);
  const howRef = useRef(null);
  const generatorRef = useRef(null);
  const bookRef = useRef(null);

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  function handleGenerate() {
    if (!year || !track || !goal) {
      setFormError(true);
      return;
    }

    setFormError(false);
    const phases = buildRoadmap(track, year, goal);
    const id = `${track}_${year}_${goal}`;
    setRoadmap({ id, trackLabel: TRACKS[track].label, phases, year, goal, name });
    setTimeout(() => scrollTo(resultRef), 60);
  }

  const currentProgress = (roadmap && progressByRoadmap[roadmap.id]) || {};

  function toggleItem(key) {
    if (!roadmap) return;
    setProgressByRoadmap((prev) => ({
      ...prev,
      [roadmap.id]: { ...(prev[roadmap.id] || {}), [key]: !((prev[roadmap.id] || {})[key]) },
    }));
  }

  function resetProgress() {
    if (!roadmap) return;
    setProgressByRoadmap((prev) => ({ ...prev, [roadmap.id]: {} }));
  }

  const { overallPct, phasePcts } = useMemo(() => {
    if (!roadmap) return { overallPct: 0, phasePcts: [] };

    let total = 0;
    let done = 0;
    const pcts = roadmap.phases.map((phase, pIdx) => {
      const items = [
        ...(phase.skills || []).map((_, i) => `${pIdx}-sk-${i}`),
        ...(phase.tools || []).map((_, i) => `${pIdx}-tl-${i}`),
        ...(phase.projects || []).filter(Boolean).map((_, i) => `${pIdx}-pr-${i}`),
      ];
      const phaseDone = items.filter((k) => currentProgress[k]).length;
      total += items.length;
      done += phaseDone;
      return items.length ? Math.round((phaseDone / items.length) * 100) : 0;
    });

    return { overallPct: total ? Math.round((done / total) * 100) : 0, phasePcts: pcts };
  }, [roadmap, currentProgress]);

  function copyRoadmapText() {
    if (!roadmap) return;
    const lines = [];
    lines.push(`${roadmap.name ? `${roadmap.name}'s ` : ''}Eduexpose Roadmap — ${roadmap.trackLabel}`);
    lines.push(`${GOAL_LABEL[roadmap.goal]} · Starting from ${YEAR_LABEL[roadmap.year]}`);
    lines.push('');

    roadmap.phases.forEach((phase, i) => {
      lines.push(`${i + 1}. ${phase.label} (${phase.time})`);
      lines.push(`   ${phase.focus}`);
      if (phase.skills?.length) lines.push(`   Skills: ${phase.skills.join('; ')}`);
      if (phase.tools?.length) lines.push(`   Tools: ${phase.tools.join('; ')}`);
      const projects = (phase.projects || []).filter(Boolean);
      if (projects.length) lines.push(`   Projects: ${projects.join('; ')}`);
      if (phase.milestone) lines.push(`   Milestone: ${phase.milestone}`);
      lines.push('');
    });

    const text = lines.join('\n');
    const finish = () => {
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2200);
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(finish).catch(finish);
    } else {
      finish();
    }
  }

  const stats = [
    { value: '12+', label: 'career tracks covered' },
    { value: '4', label: 'clear roadmap phases' },
    { value: '100%', label: 'practical, action-based planning' },
  ];

  const benefits = [
    {
      title: 'Tailored to your stage',
      body: 'A 1st-year plan and a final-year plan should never feel the same. Eduexpose adapts your roadmap to your current year, runway, and pressure points.',
      icon: '🎯',
    },
    {
      title: 'Actionable learning path',
      body: 'Instead of vague advice, you get the exact skills, tools, and project sequence that move you toward your target career outcome.',
      icon: '🧭',
    },
    {
      title: 'Portfolio-worthy projects',
      body: 'Build projects that do more than look impressive — they help from internships and placements to stronger conversations with mentors.',
      icon: '🚀',
    },
    {
      title: 'Clear direction for every goal',
      body: 'Whether your goal is placement, higher studies, startup building, or GATE preparation, the roadmap endpoint changes with your ambition.',
      icon: '✨',
    },
  ];

  const steps = [
    {
      n: '01',
      title: 'Pick your stage',
      body: 'Choose your current year, career domain, and the outcome you want to work toward.',
    },
    {
      n: '02',
      title: 'Generate the roadmap',
      body: 'Eduexpose structures the right foundation, core skills, and project milestones for your selected path.',
    },
    {
      n: '03',
      title: 'Follow the sequence',
      body: 'Work through the roadmap in a clean order so you are building momentum instead of jumping across random topics.',
    },
    {
      n: '04',
      title: 'Get expert validation',
      body: 'Book a session to review the plan, close gaps, and turn your roadmap into a stronger action strategy.',
    },
  ];

  const faqs = [
    {
      q: 'Is this roadmap really personalized, or just a template?',
      a: 'It is a guided template shaped by your current year, your preferred track, and your goal. That means a 1st-year VLSI student and a final-year web developer do not get the same plan.',
    },
    {
      q: 'What if I am not fully sure which track I want yet?',
      a: 'You can still begin with one interest and generate a roadmap. The tool is designed to help you explore direction while keeping your next steps practical and realistic.',
    },
    {
      q: 'Can I change my roadmap later?',
      a: 'Yes. You can update your selections and generate a new roadmap at any time. Your progress for each generated roadmap is tracked separately in the session.',
    },
    {
      q: 'Do I need to book a mentor session to use the roadmap?',
      a: 'No. The roadmap works on its own. The mentor session is optional and helps you validate the plan with a more experienced perspective.',
    },
    {
      q: 'What if my branch is not listed?',
      a: 'Core Engineering is available as a broader track for branches outside the more specialized paths. It is designed to give you a sensible direction even if your exact domain is not shown.',
    },
  ];

  return (
    <div className="app-shell">
      <header className="sticky-top border-bottom bg-white/90 backdrop-blur">
        <div className="container d-flex align-items-center justify-content-between gap-3 py-3">
          <button className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-3" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/image.png" alt="Eduexpose" className="img-fluid" style={{ width: 46, height: 46 }} />
            <div className="text-start">
              <div className="fw-bold text-dark">Eduexpose</div>
              <div className="small text-warning-emphasis">Unleash Your Skills</div>
            </div>
          </button>

          <nav className="d-none d-lg-flex gap-2">
            <button className="btn btn-link text-dark fw-semibold text-decoration-none" onClick={() => scrollTo(whyRef)}>Why this exists</button>
            <button className="btn btn-link text-dark fw-semibold text-decoration-none" onClick={() => scrollTo(howRef)}>How it works</button>
            <button className="btn btn-link text-dark fw-semibold text-decoration-none" onClick={() => scrollTo(generatorRef)}>Roadmap builder</button>
            <button className="btn btn-link text-dark fw-semibold text-decoration-none" onClick={() => scrollTo(bookRef)}>Book a session</button>
          </nav>

          <a href="https://www.eduexpose.in/registernow" target="_blank" rel="noreferrer" className="btn btn-outline-warning fw-semibold">Request for roadmap</a>
        </div>
      </header>

      <section className="hero-section py-5">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <Eyebrow>Career roadmap · for ambitious students</Eyebrow>
              <h1 className="display-5 fw-semibold mt-3 mb-3 text-dark">Build a career path that actually fits your next move. <span className="text-warning">That’s Eduexpose.</span></h1>
              <p className="lead text-secondary">Choose your current year, pick your track, and define your goal. Eduexpose turns that signal into a practical roadmap with the skills, tools, projects, and milestones that move you forward.</p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <button className="btn btn-warning btn-lg text-dark fw-semibold px-4 shadow-sm" onClick={() => scrollTo(generatorRef)}>Draft my roadmap →</button>
                <button className="btn btn-outline-secondary btn-lg px-4" onClick={() => scrollTo(howRef)}>See how it works</button>
              </div>
              <div className="d-flex flex-wrap gap-2 mt-4">
                {['Personalized for your year', 'Domain-specific roadmap', 'Built around practical outcomes'].map((tag) => (
                  <span key={tag} className="badge rounded-pill bg-light text-primary border border-primary-subtle px-3 py-2">{tag}</span>
                ))}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card shadow-lg border-0 rounded-4 p-3 hero-shell">
                <div className="card-body rounded-4 section-surface border">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-uppercase small text-secondary">Roadmap snapshot</span>
                    <span className="badge rounded-pill text-bg-primary">Live draft</span>
                  </div>
                  <div className="d-grid gap-2">
                    {['Foundation', 'Core Skills', 'Projects & Practice', 'Placement Prep'].map((item, index) => (
                      <div key={item} className="d-flex align-items-center gap-3 rounded-3 px-3 py-2 border bg-white">
                        <span className="badge rounded-circle bg-warning text-dark p-2">{index + 1}</span>
                        <span className="flex-grow-1">{item}</span>
                        <span className="small text-secondary">Active</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-3">
        <div className="container">
          <div className="row g-3">
            {stats.map((stat) => (
              <div className="col-md-4" key={stat.label}>
                <div className="card border-0 shadow-sm rounded-4 stat-pill h-100">
                  <div className="card-body text-center py-4">
                    <div className="display-6 fw-semibold text-dark">{stat.value}</div>
                    <div className="small text-secondary mt-2">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5" ref={whyRef}>
        <div className="container">
          <SectionHead eyebrow="Why this exists" title="Students do not need more advice. They need direction that feels real." />
          <div className="row g-4">
            {benefits.map((item) => (
              <div className="col-md-6 col-xl-3" key={item.title}>
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 feature-card">
                  <div className="rounded-4 bg-primary-subtle p-3 mb-3 d-inline-flex align-items-center justify-content-center" style={{ width: 58, height: 58 }}>
                    <span className="fw-bold text-warning fs-4">{item.icon}</span>
                  </div>
                  <h3 className="h5 fw-semibold text-dark">{item.title}</h3>
                  <p className="text-secondary mb-0">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-body-tertiary" ref={howRef}>
        <div className="container">
          <SectionHead eyebrow="How it works" title="From uncertainty to direction in four simple steps." />
          <div className="row g-4">
            {steps.map((step) => (
              <div className="col-12" key={step.n}>
                <div className="card border-0 shadow-sm rounded-4 p-4">
                  <div className="row g-3 align-items-center">
                    <div className="col-md-2">
                      <div className="bg-primary-subtle rounded-4 p-3 text-center fs-5 fw-bold text-warning">{step.n}</div>
                    </div>
                    <div className="col-md-10">
                      <h3 className="h5 fw-semibold text-dark">{step.title}</h3>
                      <p className="text-secondary mb-0">{step.body}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5" ref={generatorRef}>
        <div className="container">
          <SectionHead eyebrow="Roadmap builder" title="Build the plan that fits your stage, track, and ambition." sub="Choose your year, domain, and goal. Eduexpose converts that into a practical roadmap you can follow with clarity." />

          <div className="card border-0 shadow-sm rounded-4 p-4 p-lg-5 section-surface">
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary">Your name (optional)</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder="e.g. Satya" />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">Your current year</label>
              <div className="d-flex flex-wrap gap-2">
                {[['1st', '1st year'], ['2nd', '2nd year'], ['3rd', '3rd year'], ['final', 'Final year'], ['grad', 'Graduated, still job-hunting']].map(([value, label]) => (
                  <Pill key={value} active={year === value} onClick={() => setYear(value)}>{label}</Pill>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">What interests you</label>
              <div className="d-flex flex-wrap gap-2">
                {Object.entries(TRACKS).map(([key, entry]) => (
                  <Pill key={key} active={track === key} onClick={() => setTrack(key)}>{entry.label}</Pill>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">Your goal</label>
              <div className="d-flex flex-wrap gap-2">
                {[['job', 'Get placed after graduation'], ['higher', 'Higher studies (MTech / MS)'], ['gate', 'Gate preparation'], ['startup', 'Build my own startup']].map(([value, label]) => (
                  <Pill key={value} active={goal === value} onClick={() => setGoal(value)}>{label}</Pill>
                ))}
              </div>
            </div>

            <button className="btn btn-warning btn-lg text-dark fw-semibold" onClick={handleGenerate}>Generate my roadmap →</button>
            {formError && <div className="text-danger mt-3">Pick your year, track and goal above — all three shape the plan.</div>}

            {roadmap && (
              <div className="mt-5" ref={resultRef}>
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 border-bottom pb-3 mb-4">
                  <div>
                    <h3 className="h4 fw-semibold mb-1 text-dark">{roadmap.name ? `${roadmap.name}'s` : 'Your'} Eduexpose Roadmap — {roadmap.trackLabel}</h3>
                    <div className="small text-primary fw-semibold">{GOAL_LABEL[roadmap.goal]} · Starting from {YEAR_LABEL[roadmap.year]}</div>
                  </div>
                  <div className="text-secondary small">Checked-off items are kept for this session — regenerate any time to update the plan.</div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="progress flex-grow-1" role="progressbar" aria-label="Roadmap completion">
                    <div className="progress-bar bg-warning" style={{ width: `${overallPct}%` }}></div>
                  </div>
                  <span className="small text-secondary">{overallPct}% done</span>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  <button className="btn btn-outline-secondary" onClick={copyRoadmapText}>{copyState === 'copied' ? 'Roadmap copied ✓' : 'Copy roadmap as text'}</button>
                  <button className="btn btn-outline-secondary" onClick={() => window.print()}>Print / save as PDF</button>
                  <button className="btn btn-link text-secondary ms-lg-auto" onClick={resetProgress}>Reset progress</button>
                </div>

                <div className="row g-4">
                  {roadmap.phases.map((phase, i) => (
                    <div className="col-12" key={`${phase.label}-${i}`}>
                      <div className="card border-0 bg-body-tertiary rounded-4 p-4">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                          <h4 className="h5 fw-semibold mb-0 text-dark">{phase.label}</h4>
                          <div className="d-flex align-items-center gap-3 small text-secondary">
                            <span>{phasePcts[i]}% done</span>
                            <span className="text-primary fw-semibold">{phase.time}</span>
                          </div>
                        </div>
                        <p className="text-secondary">{phase.focus}</p>

                        <div className="row g-3 mt-1">
                          {[
                            ['Skills to build', phase.skills, 'sk'],
                            ['Tools & resources', phase.tools, 'tl'],
                            ['Projects to build', (phase.projects || []).filter(Boolean), 'pr'],
                          ].map(([heading, list, prefix]) => (
                            <div className="col-md-4" key={heading}>
                              <h5 className="small text-uppercase text-secondary fw-semibold">{heading}</h5>
                              {(list || []).map((item, idx) => {
                                const key = `${i}-${prefix}-${idx}`;
                                const done = !!currentProgress[key];
                                return (
                                  <label key={idx} className="d-flex gap-2 align-items-start mb-2">
                                    <input type="checkbox" className="form-check-input mt-1" checked={done} onChange={() => toggleItem(key)} />
                                    <span className={done ? 'text-decoration-line-through text-secondary' : ''}>{item}</span>
                                  </label>
                                );
                              })}
                            </div>
                          ))}
                        </div>

                        {phase.milestone && <div className="border-top mt-3 pt-3 text-warning fw-semibold">◆ {phase.milestone}</div>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card border-0 shadow-sm rounded-4 p-4 mt-4">
                  <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
                    <p className="mb-0 text-secondary">Want someone to check this plan makes sense for you specifically?</p>
                    <button className="btn btn-warning text-dark fw-semibold" onClick={() => scrollTo(bookRef)}>Book a guidance session →</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-5 bg-body-tertiary" ref={bookRef}>
        <div className="container">
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-5">
              <Eyebrow>Book a session</Eyebrow>
              <h2 className="mt-3 mb-3 display-6 fw-semibold text-dark">Get a mentor to review your Career Roadmap</h2>
              <p className="text-secondary">Book a short session with a mentor who understands your track. You’ll get feedback on your roadmap, a sharper action plan, and the confidence to move forward without second-guessing.</p>
              <div className="d-grid gap-2">
                {[
                  'Bring the roadmap you just generated, or come in with just your questions.',
                  'We match you with a mentor from your track, not a generalist.',
                  'You leave with a plan adjusted for your specific situation.',
                ].map((item) => (
                  <div key={item} className="d-flex gap-2 align-items-start">
                    <span className="badge rounded-circle bg-warning text-dark">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="d-flex flex-column h-100 justify-content-between gap-4">
                  <div>
                    <span className="badge rounded-pill text-bg-primary-subtle text-primary fw-semibold">Mentor booking</span>
                    <h3 className="h4 fw-semibold mt-3 mb-2 text-dark">Book your mentor session</h3>
                    <p className="text-secondary">Bring your roadmap, your questions, or both. We’ll help you turn your plan into a more confident next step.</p>
                  </div>
                  <div className="d-grid gap-2">
                    {[
                      'Get feedback on the roadmap you just generated.',
                      'Meet a mentor from the track that matches your goal.',
                      'Leave with a sharper, more realistic action plan.',
                    ].map((item) => (
                      <div key={item} className="d-flex gap-2 align-items-start">
                        <span className="badge rounded-circle bg-warning text-dark">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <a href="https://www.eduexpose.in/registernow" target="_blank" rel="noreferrer" className="btn btn-warning text-dark fw-semibold w-auto">Book your mentor session →</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <SectionHead eyebrow="Student proof" title="The value is simple: less guesswork, more momentum." />
          <div className="row g-4">
            {[
              { quote: 'The roadmap helped me stop browsing random advice and start following a real sequence.', name: 'Aarav, 2nd year CS' },
              { quote: 'I finally had a clear list of skills, tools and projects for the exact track I want.', name: 'Nisha, 3rd year ECE' },
              { quote: 'It made my plan feel more serious and gave me confidence before speaking to mentors.', name: 'Karthik, final year' },
            ].map((item) => (
              <div className="col-md-4" key={item.name}>
                <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                  <div className="display-6 text-warning">“</div>
                  <p className="text-dark">“{item.quote}”</p>
                  <div className="small text-secondary text-uppercase">{item.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-body-tertiary">
        <div className="container">
          <SectionHead eyebrow="Common questions" title="The doubts students usually have before they commit to a path." />
          <div className="row">
            <div className="col-lg-8">
              <div className="accordion" id="faqAccordion">
                {faqs.map((item, index) => (
                  <div className="accordion-item" key={item.q}>
                    <h2 className="accordion-header" id={`heading-${index}`}>
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${index}`} aria-expanded="false" aria-controls={`collapse-${index}`}>
                        {item.q}
                      </button>
                    </h2>
                    <div id={`collapse-${index}`} className="accordion-collapse collapse" aria-labelledby={`heading-${index}`} data-bs-parent="#faqAccordion">
                      <div className="accordion-body text-secondary">{item.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-top bg-white py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <img src="/image.png" alt="Eduexpose" className="img-fluid" style={{ width: 46, height: 46 }} />
                <div>
                  <div className="fw-bold text-dark">Eduexpose</div>
                  <div className="small text-warning-emphasis">Unleash Your Skills</div>
                </div>
              </div>
              <p className="text-secondary mb-0">Career roadmaps for engineering freshers — built around Indian college timelines, from 1st year to placement.</p>
            </div>
            <div className="col-md-4 col-lg-2">
              <h4 className="small text-uppercase text-secondary fw-semibold">Explore</h4>
              <div className="d-grid gap-2">
                <button className="btn btn-link text-decoration-none text-secondary p-0 text-start" onClick={() => scrollTo(whyRef)}>Why Eduexpose</button>
                <button className="btn btn-link text-decoration-none text-secondary p-0 text-start" onClick={() => scrollTo(howRef)}>How it works</button>
                <button className="btn btn-link text-decoration-none text-secondary p-0 text-start" onClick={() => scrollTo(generatorRef)}>Roadmap tool</button>
                <button className="btn btn-link text-decoration-none text-secondary p-0 text-start" onClick={() => scrollTo(bookRef)}>Book a session</button>
              </div>
            </div>
            <div className="col-md-4 col-lg-3">
              <h4 className="small text-uppercase text-secondary fw-semibold">Tracks</h4>
              <div className="d-grid gap-2 text-secondary">
                {Object.values(TRACKS).map((trackItem) => <span key={trackItem.label}>{trackItem.label}</span>)}
              </div>
            </div>
            <div className="col-md-4 col-lg-3">
              <h4 className="small text-uppercase text-secondary fw-semibold">Contact</h4>
              <div className="text-secondary d-grid gap-2">
                <span>upskilling@eduexpose.in</span>
                <span>Vivin Towers, Cross Road, opp. YSR Statue, Ayyappa Society, Chanda Naik Nagar, Madhapur, Hyderabad, Telangana 500081</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
