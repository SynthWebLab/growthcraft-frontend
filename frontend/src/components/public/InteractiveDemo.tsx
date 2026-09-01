"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  Terminal,
  Code,
  Eye,
  Server,
  User,
  Clock,
  Check,
  Mail,
  Database,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Code Snippets
const expressCode = `const app = express();

app.post('/api/enroll', auth, async (req, res) => {
  const { courseId, userId } = req.body;
  
  const enrollment = await Enrollment.create({
    course: courseId,
    student: userId,
    status: 'active',
    startedAt: new Date()
  });
  
  await sendWelcomeEmail(userId, courseId);
  res.json({ success: true, enrollment });
});`;

const reactCode = `function CourseCard({ course }) {
  const [enrolled, setEnrolled] = useState(false);
  
  return (
    <div className="card">
      <h3>{course.title}</h3>
      <p>{course.instructor}</p>
      <span>{course.duration}h</span>
      <button onClick={() => setEnrolled(true)}>
        {enrolled ? 'Enrolled' : 'Enroll Now'}
      </button>
    </div>
  );
}`;

// Highlight mapping for each step of the animation
const backendHighlights = {
  2: [2, 3],       // API Hit
  3: [5, 6, 7, 8, 9, 10], // DB enrollment create
  4: [12],         // Mail sent
  5: [13],         // Res.json response
};

const frontendHighlights = {
  1: [6],          // Click button onClick
  6: [1, 8],       // setEnrolled state changes
};

// Syntax Highlighting Tokens
const keywords = new Set([
  "const", "let", "var", "function", "return", "import", "from",
  "export", "default", "if", "else", "async", "await", "new", "class"
]);
const booleans = new Set(["true", "false", "null", "undefined"]);

const tokenizeLine = (line: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let buf = "";

  const flush = () => {
    if (buf) {
      nodes.push(buf);
      buf = "";
    }
  };

  while (i < line.length) {
    // Comments
    if (line[i] === "/" && line[i + 1] === "/") {
      flush();
      nodes.push(
        <span key={i} className="text-gray-500">
          {line.slice(i)}
        </span>
      );
      return nodes;
    }

    // Strings
    if (line[i] === "'" || line[i] === '"' || line[i] === "`") {
      flush();
      const q = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== q) j++;
      j++;
      nodes.push(
        <span key={i} className="text-emerald-400">
          {line.slice(i, j)}
        </span>
      );
      i = j;
      continue;
    }

    // Words
    if (/[a-zA-Z_$]/.test(line[i])) {
      flush();
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      if (keywords.has(word)) {
        nodes.push(
          <span key={i} className="text-purple-400 font-semibold">
            {word}
          </span>
        );
      } else if (booleans.has(word)) {
        nodes.push(
          <span key={i} className="text-amber-400">
            {word}
          </span>
        );
      } else if (/[A-Z]/.test(word[0])) {
        // Class/Component capitalization
        nodes.push(
          <span key={i} className="text-blue-400">
            {word}
          </span>
        );
      } else {
        nodes.push(word);
      }
      i = j;
      continue;
    }

    // Numbers
    if (/\d/.test(line[i])) {
      flush();
      let j = i;
      while (j < line.length && /\d/.test(line[j])) j++;
      nodes.push(
        <span key={i} className="text-amber-300">
          {line.slice(i, j)}
        </span>
      );
      i = j;
      continue;
    }

    buf += line[i];
    i++;
  }

  flush();
  return nodes;
};

interface WindowHeaderProps {
  title: string;
  icon: React.ReactNode;
  active: boolean;
  minimized: boolean;
  maximized: boolean;
  onSelect: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

const WindowHeader = ({
  title,
  icon,
  active,
  minimized,
  maximized,
  onSelect,
  onClose,
  onMinimize,
  onMaximize,
}: WindowHeaderProps) => (
  <div
    className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-black/40 backdrop-blur-md border-b border-white/10 select-none cursor-default"
    onClick={onSelect}
  >
    {/* Mac Traffic Light Dots */}
    <div className="flex items-center gap-2 group/dots">
      {/* Close (Red) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 flex items-center justify-center transition-all active:scale-90"
        title="Close"
      >
        <svg
          className="w-[8px] h-[8px] opacity-0 group-hover/dots:opacity-100 transition-opacity"
          viewBox="0 0 12 12"
          fill="none"
          stroke="#4a0002"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="3" x2="9" y2="9" />
          <line x1="9" y1="3" x2="3" y2="9" />
        </svg>
      </button>

      {/* Minimize (Yellow) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMinimize();
        }}
        className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 flex items-center justify-center transition-all active:scale-90"
        title="Minimize"
      >
        <svg
          className="w-[8px] h-[8px] opacity-0 group-hover/dots:opacity-100 transition-opacity"
          viewBox="0 0 12 12"
          fill="none"
          stroke="#995700"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="2" y1="6" x2="10" y2="6" />
        </svg>
      </button>

      {/* Maximize / Expand (Green) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMaximize();
        }}
        className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 flex items-center justify-center transition-all active:scale-90"
        title={maximized ? "Restore" : "Expand"}
      >
        {maximized ? (
          /* Restore icon: two overlapping small rectangles */
          <svg
            className="w-[7px] h-[7px] opacity-0 group-hover/dots:opacity-100 transition-opacity"
            viewBox="0 0 12 12"
            fill="none"
            stroke="#006500"
            strokeWidth="1.5"
          >
            <rect x="1" y="3" width="7" height="7" rx="1" />
            <path d="M4 3V2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H9" />
          </svg>
        ) : (
          /* Expand icon: diagonal arrows pointing to corners */
          <svg
            className="w-[8px] h-[8px] opacity-0 group-hover/dots:opacity-100 transition-opacity"
            viewBox="0 0 12 12"
            fill="none"
            stroke="#006500"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="8,1 11,1 11,4" />
            <polyline points="4,11 1,11 1,8" />
            <line x1="11" y1="1" x2="7" y2="5" />
            <line x1="1" y1="11" x2="5" y2="7" />
          </svg>
        )}
      </button>
    </div>
    
    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-400 font-mono">
      {icon}
      <span>{title}</span>
    </div>
    <div className="w-[52px]" /> {/* spacer to balance the traffic lights width */}
  </div>
);

export const InteractiveDemo = () => {
  // Demo Animation States
  // 0: idle, 1: click-react, 2: send-api, 3: db-create, 4: send-mail, 5: api-response, 6: state-update, 7: complete
  const [step, setStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [logs, setLogs] = useState<Array<{ text: string; type: "api" | "db" | "mail" | "success" }>>([]);
  const [isConsoleExpanded, setIsConsoleExpanded] = useState<boolean>(true);
  
  // Draggable Window layering zIndices
  const [zIndices, setZIndices] = useState({
    preview: 3,
    frontend: 2,
    backend: 1,
  });

  // Window Interactivity States
  const [windowStates, setWindowStates] = useState({
    backend: { closed: false, minimized: false, maximized: false },
    frontend: { closed: false, minimized: false, maximized: false },
    preview: { closed: false, minimized: false, maximized: false },
  });

  // Mobile Tabs
  const [activeMobileTab, setActiveMobileTab] = useState<"preview" | "frontend" | "backend">("preview");

  const containerRef = useRef<HTMLDivElement>(null);

  const bringToFront = (windowKey: "preview" | "frontend" | "backend") => {
    setZIndices((prev) => {
      const maxZ = Math.max(...Object.values(prev));
      if (prev[windowKey] === maxZ) return prev;
      return {
        ...prev,
        [windowKey]: maxZ + 1,
      };
    });
    // On mobile, sync the tab selection
    setActiveMobileTab(windowKey);
  };

  // Window states: "open" | "closed" | "minimized"
  // closed = window hidden, app still in dock, dock click reopens
  // minimized = window hidden, dock click restores
  // Both fully hide the window — the difference is just the dock indicator
  type WinVisibility = "open" | "closed" | "minimized";

  const closeWindow = (key: "backend" | "frontend" | "preview") => {
    setWindowStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], closed: true, minimized: false, maximized: false },
    }));
  };

  const minimizeWindow = (key: "backend" | "frontend" | "preview") => {
    setWindowStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], minimized: true, maximized: false },
    }));
  };

  const toggleMaximize = (key: "backend" | "frontend" | "preview") => {
    setWindowStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], maximized: !prev[key].maximized },
    }));
  };

  const isWindowVisible = (key: "backend" | "frontend" | "preview") => {
    return !windowStates[key].closed && !windowStates[key].minimized;
  };

  const handleDockClick = (key: "backend" | "frontend" | "preview") => {
    const state = windowStates[key];

    if (state.closed || state.minimized) {
      // Reopen the window — like clicking an app in macOS dock
      setWindowStates((prev) => ({
        ...prev,
        [key]: { ...prev[key], closed: false, minimized: false },
      }));
      bringToFront(key);
    } else {
      // Window is visible — if it's in front, minimize it; otherwise bring to front
      const isFront = zIndices[key] === Math.max(...Object.values(zIndices));
      if (isFront) {
        minimizeWindow(key);
      } else {
        bringToFront(key);
      }
    }
  };

  const addLog = (text: string, type: "api" | "db" | "mail" | "success") => {
    setLogs((prev) => [...prev, { text, type }]);
  };

  // Run the step-by-step enrollment animation
  useEffect(() => {
    if (!isPlaying) return;

    const runDemo = async () => {
      // Step 1: Click and trigger React state click
      setStep(1);
      setWindowStates((prev) => ({
        ...prev,
        frontend: { closed: false, minimized: false, maximized: prev.frontend.maximized },
      }));
      bringToFront("frontend");
      addLog("🖱️ Click: CourseCard 'Enroll Now' button clicked", "api");
      await new Promise((r) => setTimeout(r, 1200));

      // Step 2: Request sent to API endpoint
      setStep(2);
      setWindowStates((prev) => ({
        ...prev,
        backend: { closed: false, minimized: false, maximized: prev.backend.maximized },
      }));
      bringToFront("backend");
      addLog("🚀 API: POST /api/enroll { courseId: 'mern-101', userId: 'u_99' }", "api");
      await new Promise((r) => setTimeout(r, 1500));

      // Step 3: MongoDB record creation
      setStep(3);
      addLog("💾 DB: Creating new active enrollment document...", "db");
      await new Promise((r) => setTimeout(r, 1400));
      addLog("💾 DB: Enrollment created successfully (ID: enroll_72a9)", "db");
      await new Promise((r) => setTimeout(r, 800));

      // Step 4: Dispatch Welcome Email
      setStep(4);
      addLog("✉️ MAIL: Dispatching welcome email & syllabus check list...", "mail");
      await new Promise((r) => setTimeout(r, 1400));
      addLog("✉️ MAIL: Email successfully sent to user email server", "mail");
      await new Promise((r) => setTimeout(r, 800));

      // Step 5: Express Response JSON back to Client
      setStep(5);
      addLog("🟢 Response: { success: true, enrollment: {...} } (200 OK)", "success");
      await new Promise((r) => setTimeout(r, 1200));

      // Step 6: Frontend state updates (enrolled -> true)
      setStep(6);
      setWindowStates((prev) => ({
        ...prev,
        frontend: { closed: false, minimized: false, maximized: prev.frontend.maximized },
      }));
      bringToFront("frontend");
      setIsEnrolled(true);
      addLog("✨ React: setEnrolled(true) - Updating component state", "success");
      await new Promise((r) => setTimeout(r, 1200));

      // Step 7: Complete! Show live preview card transition
      setStep(7);
      setWindowStates((prev) => ({
        ...prev,
        preview: { closed: false, minimized: false, maximized: prev.preview.maximized },
      }));
      bringToFront("preview");
      addLog("🎉 Flow complete! Student is successfully enrolled.", "success");
      setIsPlaying(false);
    };

    runDemo();
  }, [isPlaying]);

  const triggerEnrollment = () => {
    if (isPlaying || isEnrolled) return;
    setIsPlaying(true);
    setLogs([]);
  };

  const resetDemo = () => {
    setStep(0);
    setIsPlaying(false);
    setIsEnrolled(false);
    setLogs([]);
    setWindowStates({
      backend: { closed: false, minimized: false, maximized: false },
      frontend: { closed: false, minimized: false, maximized: false },
      preview: { closed: false, minimized: false, maximized: false },
    });
  };

  const getHighlightClass = (codeWindow: "backend" | "frontend", lineIndex: number) => {
    const highlights = codeWindow === "backend" ? backendHighlights : frontendHighlights;
    const activeLines = (highlights as any)[step];
    if (activeLines && activeLines.includes(lineIndex + 1)) {
      return "bg-primary/20 border-l-2 border-primary text-white pl-1 font-bold duration-300 shadow-[inset_4px_0_0_rgba(247,100,60,0.4)]";
    }
    return "pl-2 opacity-80 duration-300";
  };

  return (
    <div className="w-full flex flex-col gap-6 relative select-none">
      
      {/* Simulation Controls Banner */}
      <div className="flex items-center justify-between bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-neutral-300 uppercase">
            MERN Request Flow Simulator
          </span>
        </div>
        <div className="flex gap-2">
          {isEnrolled || step === 7 ? (
            <button
              onClick={resetDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-semibold border border-white/10 transition active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo
            </button>
          ) : (
            <button
              disabled={isPlaying}
              onClick={triggerEnrollment}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none rounded-lg text-xs font-bold shadow-md transition active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Run Flow
            </button>
          )}
        </div>
      </div>

      {/* Mobile view selector tabs */}
      <div className="flex md:hidden bg-neutral-900 border border-white/10 rounded-lg p-1 gap-1">
        <button
          onClick={() => handleDockClick("preview")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition ${
            activeMobileTab === "preview" && isWindowVisible("preview")
              ? "bg-primary text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          UI Card
        </button>
        <button
          onClick={() => handleDockClick("frontend")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition ${
            activeMobileTab === "frontend" && isWindowVisible("frontend")
              ? "bg-primary text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          React Component
        </button>
        <button
          onClick={() => handleDockClick("backend")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition ${
            activeMobileTab === "backend" && isWindowVisible("backend")
              ? "bg-primary text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          Express API
        </button>
      </div>

      {/* Interactive Desktop Area */}
      <div
        ref={containerRef}
        className="w-full relative aspect-[3/2] min-h-[380px] sm:min-h-[420px] md:min-h-[460px] lg:min-h-[480px] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-4"
        style={{
          backgroundImage: "url('/macbg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 1. EXPRESS BACKEND WINDOW (server.js) */}
        <motion.div
          drag={!windowStates.backend.maximized}
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          onPointerDown={() => bringToFront("backend")}
          className={`absolute flex flex-col bg-black/60 backdrop-blur-xl border rounded-xl overflow-hidden shadow-2xl transition-all duration-300 w-auto md:w-[380px] lg:w-[400px] cursor-grab active:cursor-grabbing ${
            (windowStates.backend.closed || windowStates.backend.minimized) ? "hidden" : "flex"
          } ${
            windowStates.backend.maximized
              ? "top-3 left-3 right-3 bottom-14 md:top-4 md:left-4 md:right-4 md:bottom-16 w-auto h-auto z-50 border-primary/40 ring-1 ring-primary/20"
              : activeMobileTab === "backend"
                ? "top-4 left-4 right-4 w-auto z-30"
                : "hidden md:flex md:top-[15px] md:left-[15px] md:w-[380px] lg:w-[400px]"
          } ${
            step >= 2 && step <= 5 && !windowStates.backend.maximized
              ? "border-primary/50 shadow-[0_0_25px_rgba(247,100,60,0.25)] ring-1 ring-primary/30"
              : "border-white/15"
          }`}
          style={{
            zIndex: windowStates.backend.maximized ? 50 : zIndices.backend,
          }}
          animate={
            step >= 2 && step <= 5 ? { scale: 1.02 } : { scale: 1 }
          }
        >
          <WindowHeader
            title="server.js"
            icon={<Server className="w-3.5 h-3.5 text-primary" />}
            active={zIndices.backend === Math.max(...Object.values(zIndices)) && !windowStates.backend.minimized}
            minimized={windowStates.backend.minimized}
            maximized={windowStates.backend.maximized}
            onSelect={() => bringToFront("backend")}
            onClose={() => closeWindow("backend")}
            onMinimize={() => minimizeWindow("backend")}
            onMaximize={() => toggleMaximize("backend")}
          />
          
          <div className="flex flex-col flex-1 overflow-hidden">
                <div className={`p-3 font-mono text-[10px] sm:text-xs leading-relaxed overflow-y-auto bg-neutral-950/80 transition-all duration-300 ${
                  windowStates.backend.maximized ? "flex-1 max-h-none h-[180px] sm:h-[220px]" : "max-h-[140px] sm:max-h-[160px]"
                }`}>
                  <pre className="text-gray-300">
                    {expressCode.split("\n").map((line, idx) => (
                      <div key={idx} className={getHighlightClass("backend", idx)}>
                        <span className="inline-block w-5 text-right mr-3 text-neutral-600 select-none">
                          {idx + 1}
                        </span>
                        {tokenizeLine(line)}
                      </div>
                    ))}
                  </pre>
                </div>

                {/* Interactive Logs Console */}
                <div className="bg-neutral-900 border-t border-white/10 mt-auto">
                  <button
                    type="button"
                    onClick={() => setIsConsoleExpanded(!isConsoleExpanded)}
                    className="w-full flex items-center justify-between px-3 py-1 bg-neutral-950/50 hover:bg-neutral-950 text-[10px] font-mono text-neutral-400 border-b border-white/5 transition"
                  >
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-primary animate-pulse" />
                      <span>Console Logs ({logs.length})</span>
                    </div>
                    {isConsoleExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronUp className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isConsoleExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: windowStates.backend.maximized ? "110px" : "80px" }}
                        exit={{ height: 0 }}
                        className="p-2 sm:p-3 font-mono text-[9px] sm:text-[10px] overflow-y-auto bg-black leading-relaxed flex flex-col gap-1"
                      >
                        {logs.length === 0 ? (
                          <span className="text-neutral-500 italic">Waiting for endpoint enrollment triggers...</span>
                        ) : (
                          logs.map((log, index) => {
                            let color = "text-neutral-400";
                            if (log.type === "db") color = "text-amber-400";
                            if (log.type === "mail") color = "text-sky-400";
                            if (log.type === "success") color = "text-emerald-400 font-semibold";
                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`${color} flex items-start gap-1`}
                              >
                                <span className="text-neutral-600 select-none">❯</span>
                                <span>{log.text}</span>
                              </motion.div>
                            );
                          })
                        )}
                        {isPlaying && (
                          <div className="flex items-center gap-1 text-primary">
                            <span className="animate-pulse">●</span>
                            <span className="text-neutral-500 animate-pulse">executing line logic...</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
          </div>
        </motion.div>

        {/* 2. REACT FRONTEND WINDOW (CourseCard.jsx) */}
        <motion.div
          drag={!windowStates.frontend.maximized}
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          onPointerDown={() => bringToFront("frontend")}
          className={`absolute flex flex-col bg-black/60 backdrop-blur-xl border rounded-xl overflow-hidden shadow-2xl transition-all duration-300 w-auto md:w-[380px] lg:w-[400px] cursor-grab active:cursor-grabbing ${
            (windowStates.frontend.closed || windowStates.frontend.minimized) ? "hidden" : "flex"
          } ${
            windowStates.frontend.maximized
              ? "top-3 left-3 right-3 bottom-14 md:top-4 md:left-4 md:right-4 md:bottom-16 w-auto h-auto z-50 border-primary/40 ring-1 ring-primary/20"
              : activeMobileTab === "frontend"
                ? "top-4 left-4 right-4 w-auto z-30"
                : "hidden md:flex md:top-[60px] md:left-[50px] md:w-[380px] lg:w-[400px]"
          } ${
            step === 1 || step === 6 ? "border-primary/50 shadow-[0_0_25px_rgba(247,100,60,0.25)] ring-1 ring-primary/30"
              : "border-white/15"
          }`}
          style={{
            zIndex: windowStates.frontend.maximized ? 50 : zIndices.frontend,
          }}
          animate={
            step === 1 || step === 6 ? { scale: 1.02 } : { scale: 1 }
          }
        >
          <WindowHeader
            title="CourseCard.jsx"
            icon={<Code className="w-3.5 h-3.5 text-secondary" />}
            active={zIndices.frontend === Math.max(...Object.values(zIndices)) && !windowStates.frontend.minimized}
            minimized={windowStates.frontend.minimized}
            maximized={windowStates.frontend.maximized}
            onSelect={() => bringToFront("frontend")}
            onClose={() => closeWindow("frontend")}
            onMinimize={() => minimizeWindow("frontend")}
            onMaximize={() => toggleMaximize("frontend")}
          />
          
          <div className="flex flex-col flex-1 overflow-hidden">
                <div className={`p-3 font-mono text-[10px] sm:text-xs leading-relaxed overflow-y-auto bg-neutral-950/80 transition-all duration-300 ${
                  windowStates.frontend.maximized ? "flex-1 max-h-none h-[220px] sm:h-[280px]" : "max-h-[160px] sm:max-h-[180px]"
                }`}>
                  <pre className="text-gray-300">
                    {reactCode.split("\n").map((line, idx) => (
                      <div key={idx} className={getHighlightClass("frontend", idx)}>
                        <span className="inline-block w-5 text-right mr-3 text-neutral-600 select-none">
                          {idx + 1}
                        </span>
                        {tokenizeLine(line)}
                      </div>
                    ))}
                  </pre>
                </div>
          </div>
        </motion.div>

        {/* 3. INTERACTIVE PREVIEW CARD WINDOW */}
        <motion.div
          drag={!windowStates.preview.maximized}
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          onPointerDown={() => bringToFront("preview")}
          className={`absolute flex flex-col bg-black/70 backdrop-blur-xl border rounded-xl overflow-hidden shadow-2xl transition-all duration-300 w-auto md:w-[380px] lg:w-[400px] cursor-grab active:cursor-grabbing ${
            (windowStates.preview.closed || windowStates.preview.minimized) ? "hidden" : "flex"
          } ${
            windowStates.preview.maximized
              ? "top-3 left-3 right-3 bottom-14 md:top-4 md:left-4 md:right-4 md:bottom-16 w-auto h-auto z-50 border-primary/40 ring-1 ring-primary/20"
              : activeMobileTab === "preview"
                ? "top-4 left-4 right-4 w-auto z-30"
                : "hidden md:flex md:top-[105px] md:left-[85px] md:w-[380px] lg:w-[400px]"
          } ${
            step === 0 || step === 7
              ? "border-primary/50 shadow-[0_0_25px_rgba(247,100,60,0.3)] ring-1 ring-primary/30"
              : "border-white/15"
          }`}
          style={{
            zIndex: windowStates.preview.maximized ? 50 : zIndices.preview,
          }}
          animate={
            step === 0 || step === 7 ? { scale: 1.02 } : { scale: 1 }
          }
        >
          <WindowHeader
            title="Live Preview"
            icon={<Eye className="w-3.5 h-3.5 text-primary" />}
            active={zIndices.preview === Math.max(...Object.values(zIndices)) && !windowStates.preview.minimized}
            minimized={windowStates.preview.minimized}
            maximized={windowStates.preview.maximized}
            onSelect={() => bringToFront("preview")}
            onClose={() => closeWindow("preview")}
            onMinimize={() => minimizeWindow("preview")}
            onMaximize={() => toggleMaximize("preview")}
          />
          
          <div className="flex flex-col flex-1 overflow-hidden">
                <div className={`p-4 flex flex-col justify-center items-center bg-neutral-950/40 relative transition-all duration-300 ${
                  windowStates.preview.maximized ? "flex-1 h-[220px] sm:h-[280px]" : "h-[180px] sm:h-[200px]"
                }`}>
                  
                  {/* Visual Success Sparks */}
                  {isEnrolled && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute w-36 h-36 rounded-full border border-primary/20 bg-primary/5 filter blur-sm"
                      />
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute w-full h-full text-primary/40"
                      >
                        <Sparkles className="w-4 h-4 absolute top-6 left-6 animate-bounce" />
                        <Sparkles className="w-5 h-5 absolute bottom-8 right-8 animate-pulse" />
                        <Sparkles className="w-3 h-3 absolute top-4 right-16" />
                      </motion.div>
                    </div>
                  )}

                  {/* Course Card Render */}
                  <div className="w-full max-w-[320px] bg-[#1b1b1b]/80 border border-white/10 rounded-xl p-3 shadow-xl flex flex-col justify-between hover:border-primary/40 transition-colors duration-300">
                    <div>
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[9px] font-semibold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">
                          MERN Course Card
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                          <Clock className="w-3 h-3 text-neutral-500" />
                          <span>60h</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xs sm:text-sm font-bold text-white mb-1">
                        Full Stack MERN Bootcamp
                      </h3>
                      
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary font-mono">
                          N
                        </div>
                        <span className="text-[10px] text-neutral-400">
                          Nikunja & Engineering Team
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    {isEnrolled ? (
                      <div className="flex flex-col gap-2">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-full py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Enrolled Successfully!
                        </motion.div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={isPlaying}
                        onClick={triggerEnrollment}
                        className="w-full py-1.5 bg-primary hover:bg-primary/95 text-white disabled:bg-neutral-800 disabled:text-neutral-500 rounded-lg text-[11px] font-bold tracking-wide transition flex items-center justify-center gap-2 group relative overflow-hidden"
                      >
                        {isPlaying ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Enrolling...
                          </>
                        ) : (
                          <>
                            Enroll Now
                            <Play className="w-2.5 h-2.5 fill-current transition-transform group-hover:translate-x-0.5" />
                          </>
                        )}
                        {/* Hover shine */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </button>
                    )}
                  </div>
                  
                  {/* Status indicator bubble */}
                  <div className="absolute bottom-1.5 text-[9px] text-neutral-500 font-mono">
                    <span>Interactive Card Component</span>
                  </div>
                </div>
          </div>
        </motion.div>

        {/* Mac OS Style Desktop Dock (floating on top of windows, z-index 60) */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/75 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-4 shadow-2xl z-[60] transition-all duration-300">
          {/* server.js dock icon */}
          <button
            type="button"
            onClick={() => handleDockClick("backend")}
            className="flex flex-col items-center gap-1 group relative transition duration-200 hover:-translate-y-1 active:translate-y-0"
            title="server.js (Express Backend API)"
          >
            <div className="p-2 rounded-xl border transition-all duration-300 bg-primary/10 border-primary/30 text-primary group-hover:bg-primary/20 group-hover:border-primary/50 shadow-md">
              <Server className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>
            {/* Active Indicator Dot */}
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              windowStates.backend.closed
                ? "bg-white/30 scale-75"
                : windowStates.backend.minimized
                  ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)] animate-pulse"
                  : "bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"
            }`} />
          </button>

          {/* CourseCard.jsx dock icon */}
          <button
            type="button"
            onClick={() => handleDockClick("frontend")}
            className="flex flex-col items-center gap-1 group relative transition duration-200 hover:-translate-y-1 active:translate-y-0"
            title="CourseCard.jsx (React Component)"
          >
            <div className="p-2 rounded-xl border transition-all duration-300 bg-secondary/10 border-secondary/30 text-secondary group-hover:bg-secondary/20 group-hover:border-secondary/50 shadow-md">
              <Code className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>
            {/* Active Indicator Dot */}
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              windowStates.frontend.closed
                ? "bg-white/30 scale-75"
                : windowStates.frontend.minimized
                  ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)] animate-pulse"
                  : "bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"
            }`} />
          </button>

          {/* Live Preview dock icon */}
          <button
            type="button"
            onClick={() => handleDockClick("preview")}
            className="flex flex-col items-center gap-1 group relative transition duration-200 hover:-translate-y-1 active:translate-y-0"
            title="Live Preview (Course Card UI)"
          >
            <div className="p-2 rounded-xl border transition-all duration-300 bg-primary/10 border-primary/30 text-primary group-hover:bg-primary/20 group-hover:border-primary/50 shadow-md">
              <Eye className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>
            {/* Active Indicator Dot */}
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              windowStates.preview.closed
                ? "bg-white/30 scale-75"
                : windowStates.preview.minimized
                  ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)] animate-pulse"
                  : "bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"
            }`} />
          </button>
        </div>
      </div>

      {/* Instruction Helper */}
      <p className="text-[11px] sm:text-xs text-neutral-500 text-center italic mt-[-8px]">
        💡 Drag windows to rearrange. Use 🔴🟡🟢 dots to Close, Minimize, or Expand. Restore from the Dock below!
      </p>
    </div>
  );
};
