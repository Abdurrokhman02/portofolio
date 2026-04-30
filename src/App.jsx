import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// ── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#050A0F",
  bgAlt: "#080F18",
  cyan: "#00F5FF",
  cyanDim: "#00B8C4",
  cyanGlow: "rgba(0,245,255,0.15)",
  grey: "#1A2535",
  greyMid: "#2A3A50",
  greyLight: "#4A6080",
  text: "#C8E0F0",
  textDim: "#5A7A9A",
  white: "#EAF6FF",
  green: "#00FF9F",
  red: "#FF3860",
  amber: "#FFB800",
};

// ── ANIMATED BACKGROUND GRID ──────────────────────────────────────────────────
function HUDGrid() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.18 }}>
        <defs>
          <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={C.cyan} strokeWidth="0.5" />
          </pattern>
          <radialGradient id="fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="gridmask">
            <rect width="100%" height="100%" fill="url(#fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridmask)" />
      </svg>
      <FallingCode />
    </div>
  );
}

function FallingCode() {
  const cols = 20;
  const chars = "01アイウエカキクサシスロボットAIIoT█▓▒░10";
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const initial = Array.from({ length: cols }, (_, i) => ({
      id: i,
      x: (i / cols) * 100,
      y: Math.random() * -200,
      speed: 0.4 + Math.random() * 0.8,
      chars: Array.from({ length: 18 }, () => chars[Math.floor(Math.random() * chars.length)]),
      opacity: 0.05 + Math.random() * 0.15,
    }));
    setStreams(initial);

    let raf;
    const tick = () => {
      setStreams(prev =>
        prev.map(s => {
          const newY = s.y + s.speed;
          return newY > 110
            ? { ...s, y: -30, chars: Array.from({ length: 18 }, () => chars[Math.floor(Math.random() * chars.length)]) }
            : { ...s, y: newY };
        })
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: "monospace", fontSize: 11, overflow: "hidden" }}>
      {streams.map(s => (
        <div key={s.id} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, color: C.cyan, opacity: s.opacity, lineHeight: 1.4, whiteSpace: "nowrap" }}>
          {s.chars.map((c, i) => (
            <div key={i} style={{ opacity: 1 - i * 0.055 }}>{c}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── ROBOT SVG MASCOT ──────────────────────────────────────────────────────────
function RobotMascot({ scrollY }) {
  const y = useTransform(scrollY, [0, 600], [0, -80]);
  const rotate = useTransform(scrollY, [0, 600], [0, 12]);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div style={{ y, rotate, originX: 0.5, originY: 1 }} animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
      <svg width="220" height="260" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A2535" />
            <stop offset="100%" stopColor="#0A1520" />
          </linearGradient>
        </defs>

        {/* Antenna */}
        <line x1="110" y1="8" x2="110" y2="40" stroke={C.cyan} strokeWidth="2" />
        <motion.circle cx="110" cy="6" r="5" fill={C.cyan} animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} filter="url(#glow)" />

        {/* Head */}
        <rect x="65" y="40" width="90" height="72" rx="8" fill="url(#bodyGrad)" stroke={C.cyan} strokeWidth="1.5" />
        <rect x="73" y="48" width="74" height="56" rx="4" fill="#030A12" stroke={C.cyanDim} strokeWidth="0.8" />

        {/* Eyes */}
        {blink ? (
          <>
            <rect x="84" y="66" width="18" height="2" rx="1" fill={C.cyan} />
            <rect x="118" y="66" width="18" height="2" rx="1" fill={C.cyan} />
          </>
        ) : (
          <>
            <motion.rect x="84" y="58" width="18" height="18" rx="3" fill={C.cyan} animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 2, repeat: Infinity }} filter="url(#glow)" />
            <motion.rect x="118" y="58" width="18" height="18" rx="3" fill={C.cyan} animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} filter="url(#glow)" />
            <rect x="88" y="62" width="6" height="6" rx="1" fill="#030A12" />
            <rect x="122" y="62" width="6" height="6" rx="1" fill="#030A12" />
          </>
        )}

        {/* Mouth display */}
        <rect x="84" y="84" width="52" height="12" rx="3" fill="#030A12" stroke={C.cyanDim} strokeWidth="0.8" />
        <motion.rect x="87" y="87" width="8" height="6" rx="1" fill={C.green} animate={{ scaleX: [1, 1.4, 0.8, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
        <motion.rect x="98" y="87" width="8" height="6" rx="1" fill={C.green} animate={{ scaleX: [1, 0.8, 1.4, 1, 0.9] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }} />
        <motion.rect x="109" y="87" width="8" height="6" rx="1" fill={C.green} animate={{ scaleX: [1, 1.2, 1, 1.5, 0.8] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} />
        <motion.rect x="120" y="87" width="8" height="6" rx="1" fill={C.green} animate={{ scaleX: [0.8, 1, 1.3, 0.9, 1.2] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }} />

        {/* Neck */}
        <rect x="100" y="112" width="20" height="14" rx="2" fill={C.grey} stroke={C.cyanDim} strokeWidth="0.8" />

        {/* Body */}
        <rect x="50" y="126" width="120" height="90" rx="10" fill="url(#bodyGrad)" stroke={C.cyan} strokeWidth="1.5" />
        <rect x="63" y="138" width="40" height="30" rx="4" fill="#030A12" stroke={C.cyanDim} strokeWidth="0.8" />
        <motion.circle cx="83" cy="153" r="8" fill="none" stroke={C.cyan} strokeWidth="1.5" animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
        <circle cx="83" cy="153" r="3" fill={C.cyan} />

        {/* Body display */}
        <rect x="115" y="136" width="45" height="34" rx="4" fill="#030A12" stroke={C.cyanDim} strokeWidth="0.8" />
        {[0,1,2,3].map(i => (
          <motion.rect key={i} x={118} y={140 + i * 7} width={Math.random() * 20 + 15} height={4} rx={1} fill={C.cyan} style={{ opacity: 0.6 }} animate={{ width: [20, 35, 15, 30, 20] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
        ))}

        {/* Chest bolts */}
        {[[58,128],[162,128],[58,208],[162,208]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill={C.grey} stroke={C.cyanDim} strokeWidth="1" />
        ))}

        {/* Arms */}
        <rect x="14" y="130" width="30" height="60" rx="8" fill="url(#bodyGrad)" stroke={C.cyan} strokeWidth="1.5" />
        <rect x="176" y="130" width="30" height="60" rx="8" fill="url(#bodyGrad)" stroke={C.cyan} strokeWidth="1.5" />
        <rect x="14" y="186" width="30" height="20" rx="5" fill={C.grey} stroke={C.cyanDim} strokeWidth="1" />
        <rect x="176" y="186" width="30" height="20" rx="5" fill={C.grey} stroke={C.cyanDim} strokeWidth="1" />

        {/* Legs */}
        <rect x="70" y="216" width="32" height="40" rx="6" fill="url(#bodyGrad)" stroke={C.cyan} strokeWidth="1.5" />
        <rect x="118" y="216" width="32" height="40" rx="6" fill="url(#bodyGrad)" stroke={C.cyan} strokeWidth="1.5" />
        <rect x="65" y="250" width="42" height="10" rx="5" fill={C.grey} stroke={C.cyanDim} strokeWidth="1" />
        <rect x="113" y="250" width="42" height="10" rx="5" fill={C.grey} stroke={C.cyanDim} strokeWidth="1" />

        {/* Scan line */}
        <motion.line x1="50" y1="0" x2="170" y2="0" stroke={C.cyan} strokeWidth="1" opacity="0.4"
          animate={{ y1: [40, 215, 40], y2: [40, 215, 40] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
      </svg>
    </motion.div>
  );
}

// ── HUD CORNER BRACKETS ───────────────────────────────────────────────────────
function HUDBracket({ size = 16, color = C.cyan, style = {} }) {
  return (
    <svg width={size * 2} height={size * 2} viewBox={`0 0 ${size * 2} ${size * 2}`} style={style}>
      <path d={`M ${size} 2 L 2 2 L 2 ${size}`} fill="none" stroke={color} strokeWidth="1.5" />
      <path d={`M ${size} ${size * 2 - 2} L ${size * 2 - 2} ${size * 2 - 2} L ${size * 2 - 2} ${size}`} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function PlateBox({ children, label, style = {}, glowOnHover = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: "relative",
        border: `1px solid ${hovered && glowOnHover ? C.cyan : C.greyMid}`,
        background: hovered && glowOnHover ? "rgba(0,245,255,0.04)" : "rgba(8,15,24,0.85)",
        padding: "1.5rem",
        transition: "all 0.3s ease",
        boxShadow: hovered && glowOnHover ? `0 0 24px ${C.cyanGlow}, inset 0 0 12px rgba(0,245,255,0.03)` : "none",
        ...style,
      }}
    >
      {label && (
        <div style={{ position: "absolute", top: -11, left: 14, background: C.bg, padding: "0 8px", fontSize: 10, color: C.cyanDim, letterSpacing: 3, fontFamily: "monospace", textTransform: "uppercase" }}>
          {label}
        </div>
      )}
      <HUDBracket size={10} color={hovered && glowOnHover ? C.cyan : C.greyMid} style={{ position: "absolute", top: 6, left: 6 }} />
      <HUDBracket size={10} color={hovered && glowOnHover ? C.cyan : C.greyMid} style={{ position: "absolute", bottom: 6, right: 6, transform: "rotate(180deg)" }} />
      {children}
    </motion.div>
  );
}

// ── SCAN ANIMATION ON PROJECT CARD ────────────────────────────────────────────
function ProjectCard({ mission }) {
  const [scanning, setScanning] = useState(false);
  const [glitching, setGlitching] = useState(false);

  const handleHoverStart = () => {
    setScanning(true);
    setTimeout(() => setGlitching(true), 300);
  };
  const handleHoverEnd = () => {
    setScanning(false);
    setGlitching(false);
  };

  return (
    <motion.div
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      style={{ position: "relative", overflow: "hidden", cursor: "crosshair" }}
    >
      <PlateBox style={{ height: "100%", minHeight: 220 }}>
        {/* Scan line */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ top: 0, opacity: 0 }}
              animate={{ top: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`, zIndex: 10, pointerEvents: "none" }}
            />
          )}
        </AnimatePresence>

        {/* Status badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <motion.span
            animate={glitching ? { x: [0, -2, 3, -1, 0], opacity: [1, 0.6, 1, 0.8, 1] } : {}}
            transition={{ duration: 0.15, repeat: glitching ? 3 : 0 }}
            style={{ fontSize: 10, letterSpacing: 3, color: C.cyanDim, fontFamily: "monospace", textTransform: "uppercase" }}
          >
            {mission.status}
          </motion.span>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: mission.status === "ACTIVE" ? C.green : C.amber }}
          />
        </div>

        <motion.h3
          animate={glitching ? { x: [0, 3, -2, 1, 0], skewX: [0, 5, -3, 0] } : {}}
          transition={{ duration: 0.12, repeat: glitching ? 4 : 0 }}
          style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: "0.5rem", fontFamily: "monospace", letterSpacing: 1 }}
        >
          {mission.title}
        </motion.h3>

        <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.6, marginBottom: "1rem" }}>{mission.description}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {mission.tags.map(tag => (
            <span key={tag} style={{ fontSize: 10, padding: "3px 8px", border: `1px solid ${C.greyMid}`, color: C.cyanDim, fontFamily: "monospace", letterSpacing: 1 }}>
              {tag}
            </span>
          ))}
        </div>

        {scanning && (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,245,255,0.03) 100%)", pointerEvents: "none" }} />
        )}
      </PlateBox>
    </motion.div>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const sections = ["INIT", "SYS.MODULES", "MISSIONS", "LOG"];
  return (
    <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(5,10,15,0.92)", borderBottom: `1px solid ${C.greyMid}`, backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", height: 56 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
          style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} />
        <span style={{ fontFamily: "monospace", fontSize: 12, color: C.cyan, letterSpacing: 3 }}>UNIT-01 // ONLINE</span>
      </div>
      <div style={{ display: "flex", gap: "2rem" }}>
        {sections.map(s => (
          <a key={s} href={`#${s}`} style={{ fontFamily: "monospace", fontSize: 11, color: C.textDim, textDecoration: "none", letterSpacing: 2 }}
            onMouseEnter={e => e.target.style.color = C.cyan}
            onMouseLeave={e => e.target.style.color = C.textDim}
          >{s}</a>
        ))}
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 11, color: C.textDim, letterSpacing: 2 }}>{time}</span>
    </motion.nav>
  );
}

// ── SECTIONS ──────────────────────────────────────────────────────────────────
const techStack = [
  { module: "CORE.LANG", items: ["Python", "JavaScript", "C++", "Java"] },
  { module: "AI.ENGINE", items: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenCV"] },
  { module: "IOT.PROTOCOL", items: ["LoRa / LoRaWAN", "MQTT", "Arduino", "Raspberry Pi"] },
  { module: "WEB.LAYER", items: ["React", "Node.js", "REST API", "FastAPI"] },
  { module: "DATA.CORE", items: ["MySQL", "MongoDB", "Firebase", "Pandas"] },
  { module: "TOOLS.ENV", items: ["Git", "Docker", "Linux", "VS Code"] },
];

const missions = [
  {
    title: "SMART WASTE SYSTEM",
    description: "IoT-integrated waste bin monitoring with real-time fill-level detection, ML-based route optimization, and cloud dashboard for municipal management.",
    status: "ACTIVE",
    tags: ["IoT", "LoRa", "Python", "MQTT", "ML"],
  },
  {
    title: "LORA RESEARCH NODE",
    description: "Long-range wireless sensor network research using LoRaWAN. Evaluating coverage, packet loss, and signal propagation in urban environments.",
    status: "ACTIVE",
    tags: ["LoRaWAN", "RF Research", "Arduino", "Data Analysis"],
  },
  {
    title: "AI VISION CLASSIFIER",
    description: "Convolutional neural network for real-time object classification deployed on edge devices. Optimized for low-power IoT hardware.",
    status: "STANDBY",
    tags: ["CNN", "TensorFlow", "Edge AI", "OpenCV"],
  },
  {
    title: "AUTOMATED ENV. MONITOR",
    description: "Multi-sensor environmental data logger with temperature, humidity, CO2, and particulate matter tracking. Sends alerts via Telegram bot.",
    status: "COMPLETE",
    tags: ["Sensors", "Raspberry Pi", "Bot API", "Firebase"],
  },
];

const labLog = [
  { year: "2023–NOW", title: "AI & IoT Laboratory Assistant", org: "Informatics Department", desc: "Assisting researchers with hardware prototyping, sensor calibration, and data pipeline automation for smart environment projects." },
  { year: "2024", title: "Research Collaborator — LoRa Coverage Study", org: "Wireless Comm. Lab", desc: "Co-authored field research measuring LoRaWAN signal propagation across campus. Responsible for node deployment and dataset analysis." },
];

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const [bootDone, setBootDone] = useState(false);
  const [bootLines, setBootLines] = useState([]);

  const bootSequence = [
    "INITIALIZING NEURAL CORE...",
    "LOADING SYSTEM MODULES [████████████] 100%",
    "CONNECTING IOT MESH NETWORK...",
    "CALIBRATING SENSORS ✓",
    "IDENTITY CONFIRMED: INFORMATICS // AI + IOT",
    "WELCOME.",
  ];

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setBootLines(prev => [...prev, bootSequence[i]]);
      i++;
      if (i >= bootSequence.length) {
        clearInterval(t);
        setTimeout(() => setBootDone(true), 700);
      }
    }, 380);
    return () => clearInterval(t);
  }, []);

  if (!bootDone) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
        <div style={{ maxWidth: 500, width: "100%" }}>
          <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
            style={{ fontSize: 11, color: C.cyan, letterSpacing: 4, marginBottom: "2rem" }}>
            UNIT-01 BOOT SEQUENCE
          </motion.div>
          {bootLines.map((line, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              style={{ fontSize: 13, color: i === bootLines.length - 1 ? C.cyan : C.textDim, marginBottom: 8, letterSpacing: 1 }}>
              {i === bootLines.length - 1 && <span style={{ color: C.green }}>✓ </span>}{line}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ background: C.bg, color: C.text, fontFamily: "'Courier New', monospace", minHeight: "100vh", overflowX: "hidden" }}>
      <HUDGrid />
      <Navbar />

      {/* ── HERO ── */}
      <section id="INIT" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 2rem 2rem", position: "relative" }}>
        <div style={{ maxWidth: 1100, width: "100%", display: "grid", gridTemplateColumns: "1fr auto", gap: "4rem", alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ fontSize: 11, letterSpacing: 5, color: C.cyanDim, textTransform: "uppercase", marginBottom: "1rem" }}>
              ◈ SYSTEM IDENTITY CONFIRMED
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: "1rem", letterSpacing: -1 }}>
              {"< INFORMATICS"}
              <br />
              <span style={{ color: C.cyan }}>ENGINEER /&gt;</span>
            </motion.h1>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.8 }}
              style={{ height: 1, background: `linear-gradient(90deg, ${C.cyan}, transparent)`, marginBottom: "1.5rem", transformOrigin: "left" }} />

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
              style={{ fontSize: 15, color: C.textDim, lineHeight: 1.8, maxWidth: 520, marginBottom: "2rem" }}>
              Specializing in <span style={{ color: C.cyan }}>Artificial Intelligence</span> and <span style={{ color: C.green }}>Internet of Things</span>. Building smart systems that bridge the physical and digital world.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {["DOWNLOAD CV", "VIEW MISSIONS", "CONTACT"].map((btn, i) => (
                <motion.button key={btn} whileHover={{ scale: 1.04, borderColor: C.cyan }} whileTap={{ scale: 0.97 }}
                  style={{ padding: "10px 20px", background: i === 0 ? C.cyan : "transparent", color: i === 0 ? C.bg : C.cyan, border: `1px solid ${C.cyan}`, fontSize: 11, letterSpacing: 3, cursor: "pointer", fontFamily: "monospace", fontWeight: 600 }}>
                  {btn}
                </motion.button>
              ))}
            </motion.div>

            {/* Status bar */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
              style={{ marginTop: "2rem", display: "flex", gap: "2rem", fontSize: 10, color: C.textDim, letterSpacing: 2 }}>
              {[["STATUS", "ONLINE"], ["MODE", "BUILD"], ["LAB", "ACTIVE"]].map(([k, v]) => (
                <div key={k}>{k}: <span style={{ color: C.cyan }}>{v}</span></div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 1 }}>
            <RobotMascot scrollY={scrollY} />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: C.textDim, letterSpacing: 3, textAlign: "center" }}>
          ▼ SCROLL TO EXPLORE
        </motion.div>
      </section>

      {/* ── TECH STACK ── */}
      <section id="SYS.MODULES" style={{ padding: "6rem 2rem", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader label="02" title="SYS.MODULES" subtitle="Installed technology stack" />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginTop: "3rem" }}>
            {techStack.map((mod, i) => (
              <motion.div key={mod.module}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}>
                <PlateBox label={mod.module} glowOnHover>
                  {mod.items.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: C.text }}>
                      <span style={{ color: C.cyan, fontSize: 8 }}>◆</span> {item}
                    </div>
                  ))}
                </PlateBox>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="MISSIONS" style={{ padding: "6rem 2rem", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader label="03" title="ACTIVE MISSIONS" subtitle="Hover over a mission to run diagnostics" />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginTop: "3rem" }}>
            {missions.map((mission, i) => (
              <motion.div key={mission.title}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}>
                <ProjectCard mission={mission} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LAB EXPERIENCE ── */}
      <section id="LOG" style={{ padding: "6rem 2rem", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader label="04" title="LAB.ASSISTANT.LOG" subtitle="Recorded operational experience" />

          <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {labLog.map((entry, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}>
                <PlateBox glowOnHover>
                  <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "2rem", alignItems: "start" }}>
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: 3, color: C.cyanDim, marginBottom: 4 }}>TIMESTAMP</div>
                      <div style={{ fontSize: 13, color: C.cyan, fontFamily: "monospace" }}>{entry.year}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: C.white, marginBottom: 4 }}>{entry.title}</div>
                      <div style={{ fontSize: 11, color: C.cyanDim, letterSpacing: 2, marginBottom: 10 }}>{entry.org.toUpperCase()}</div>
                      <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7 }}>{entry.desc}</p>
                    </div>
                  </div>
                </PlateBox>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${C.greyMid}`, padding: "2rem", textAlign: "center", position: "relative" }}>
        <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 3, marginBottom: 8 }}>UNIT-01 // INFORMATICS AI+IoT ENGINEER</div>
        <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: 10, color: C.cyanDim, letterSpacing: 2 }}>
          SYSTEM UPTIME: OPERATIONAL ◈ ALL MODULES LOADED
        </motion.div>
      </footer>
    </div>
  );
}

function SectionHeader({ label, title, subtitle }) {
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
      <div style={{ fontSize: 10, color: C.cyanDim, letterSpacing: 4, marginBottom: 8 }}>[ {label} ]</div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: C.white, letterSpacing: 2, margin: 0 }}>{title}</h2>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.cyanDim}, transparent)` }} />
      </div>
      <p style={{ fontSize: 12, color: C.textDim, marginTop: 8, letterSpacing: 2 }}>{subtitle.toUpperCase()}</p>
    </motion.div>
  );
}