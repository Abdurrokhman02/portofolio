import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import profileImg from "./assets/profile.jpg";
import cvFile from "./assets/CV_ATS_Abdurrokhman.pdf";
import { image } from "framer-motion/client";
import imgSmartTraffic from "./assets/projects/Smart-Traffic-Light.jpeg";
import imgSersam from "./assets/projects/sersam.jpeg";
import imgKopling from "./assets/projects/kopling.jpeg";
import imgWatering from "./assets/projects/watering.jpeg";
import imgRoboticArm from "./assets/projects/arm.jpeg";

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

// ── PROFILE HUD ──────────────────────────────────────────────
function ProfileHUD({ scrollY }) {
  const y = useTransform(scrollY, [0, 600], [0, -40]);

  return (
    <motion.div 
      // Ukuran container dibesarkan dari 320 ke 440
      style={{ y, position: "relative", width: 440, height: 440, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {/* 1. LINGKARAN ANIMASI SVG (HUD RINGS) */}
      {/* viewBox disesuaikan ke 440 */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 440 440">
        
        {/* Ring Luar */}
        <motion.circle
          cx="220" cy="220" r="200" // cx, cy disesuaikan jadi nilai tengah (440/2), radius (r) dibesarkan
          fill="none" stroke={C.cyanDim} strokeWidth="1.5" strokeDasharray="6 18"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ originX: "50%", originY: "50%" }}
        />
        
        {/* Ring Tengah */}
        <motion.circle
          cx="220" cy="220" r="180"
          fill="none" stroke={C.cyan} strokeWidth="3" strokeDasharray="100 50 30 50"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ originX: "50%", originY: "50%", filter: "drop-shadow(0 0 8px rgba(0,245,255,0.5))" }}
        />
        
        {/* Ring Dalam */}
        <motion.circle
          cx="220" cy="220" r="160"
          fill="none" stroke={C.green} strokeWidth="1.5" strokeDasharray="200 40"
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ originX: "50%", originY: "50%" }}
        />

        {/* Garis Crosshair / Pembidik Statis (Koordinat disesuaikan) */}
        <path 
          d="M 220 0 L 220 20 M 220 420 L 220 440 M 0 220 L 20 220 M 420 220 L 440 220" 
          stroke={C.cyan} strokeWidth="2" 
        />
      </svg>

      {/* 2. BINGKAI FOTO & FOTOMU */}
      <div style={{
        position: "relative",
        width: 290, // Ukuran fotomu dibesarkan dari 210 ke 290
        height: 290, // Ukuran fotomu dibesarkan
        borderRadius: "50%",
        overflow: "hidden",
        border: `3px solid ${C.cyan}`,
        boxShadow: `0 0 25px ${C.cyanGlow}, inset 0 0 20px ${C.cyanGlow}`,
        background: C.bgAlt 
      }}>
        <img 
          src={profileImg} 
          alt="Profile" 
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "contrast(110%) brightness(0.9)"
          }} 
        />
        
        {/* Garis Scanline */}
        <motion.div
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            left: 0, right: 0, height: "3px",
            background: "linear-gradient(to bottom, transparent, rgba(0,245,255,0.8), transparent)",
            boxShadow: "0 0 12px rgba(0,245,255,0.6)",
            zIndex: 10
          }}
        />
      </div>

      {/* 3. TEKS STATUS HUD (Posisi disesuaikan sedikit karena ukuran berubah) */}
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4] }} 
        transition={{ duration: 2, repeat: Infinity }}
        style={{ position: "absolute", right: -20, top: 50, background: "rgba(5,10,15,0.8)", border: `1px solid ${C.cyanDim}`, padding: "4px 8px", fontSize: 10, color: C.cyan, fontFamily: "monospace", letterSpacing: 2 }}
      >
        SYS.ACTIVE
      </motion.div>
      
      <motion.div 
        animate={{ opacity: [0.8, 0.2, 0.8] }} 
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        style={{ position: "absolute", left: -30, bottom: 80, background: "rgba(5,10,15,0.8)", border: `1px solid ${C.green}`, padding: "4px 8px", fontSize: 10, color: C.green, fontFamily: "monospace", letterSpacing: 2 }}
      >
        TARGET_LOCK
      </motion.div>
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
      style={{ position: "relative", overflow: "hidden", cursor: "crosshair", height: "100%" }} /* <-- Tambah height 100% */
    >
      <PlateBox style={{ height: "100%", minHeight: 220, display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
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

        {/* Bungkus konten atas agar bisa mendorong tags ke bawah */}
        <div style={{ flexGrow: 1 }}>
          {/* Status badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
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

          {/* --- BAGIAN GAMBAR --- */}
          {mission.image && (
            <div style={{ 
              position: "relative", 
              marginBottom: "1.25rem", 
              height: "140px", 
              overflow: "hidden", 
              border: `1px solid ${scanning ? C.cyan : C.greyMid}`,
              borderRadius: "2px"
            }}>
              <img 
                src={mission.image} 
                alt={mission.title} 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover", 
                  display: "block",
                  transition: "all 0.5s ease",
                  filter: scanning ? "grayscale(0%)" : "grayscale(100%) sepia(100%) hue-rotate(150deg) brightness(0.6) contrast(1.2)",
                  transform: scanning ? "scale(1.05)" : "scale(1)"
                }} 
              />
              <div style={{
                position: "absolute",
                inset: 0,
                background: "repeating-linear-gradient(transparent, transparent 2px, rgba(0, 0, 0, 0.15) 3px, rgba(0, 0, 0, 0.15) 3px)",
                pointerEvents: "none"
              }} />
            </div>
          )}

          <motion.h3
            animate={glitching ? { x: [0, 3, -2, 1, 0], skewX: [0, 5, -3, 0] } : {}}
            transition={{ duration: 0.12, repeat: glitching ? 4 : 0 }}
            style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: "0.5rem", fontFamily: "monospace", letterSpacing: 1 }}
          >
            {mission.title}
          </motion.h3>

          <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.6, marginBottom: "1.5rem" }}>{mission.description}</p>
        </div>

        {/* Tags, dipaksa turun ke bawah dengan marginTop: "auto" */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
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
  const [isOpen, setIsOpen] = useState(false); // State untuk buka/tutup menu HP

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const sections = ["INIT", "SYS.MODULES", "MISSIONS", "LOG", "CONTACT"];

  return (
    <>
      <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(5,10,15,0.92)", borderBottom: `1px solid ${C.greyMid}`, backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", height: 56 }}>
        
        {/* Logo Kiri */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} />
          <span style={{ fontFamily: "monospace", fontSize: 12, color: C.cyan, letterSpacing: 3 }}>PORTFOLIO // ONLINE</span>
        </div>

        {/* Menu Desktop (Disembunyikan saat di HP via CSS) */}
        <div className="nav-desktop-links">
          {sections.map(s => (
            <a key={s} href={`#${s}`} style={{ fontFamily: "monospace", fontSize: 11, color: C.textDim, textDecoration: "none", letterSpacing: 2 }}
              onMouseEnter={e => e.target.style.color = C.cyan}
              onMouseLeave={e => e.target.style.color = C.textDim}
            >{s}</a>
          ))}
        </div>

        {/* Jam & Tombol Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span className="nav-time" style={{ fontFamily: "monospace", fontSize: 11, color: C.textDim, letterSpacing: 2 }}>{time}</span>
          
          <button 
            className="hamburger-btn" 
            onClick={() => setIsOpen(!isOpen)}
            style={{ fontFamily: "monospace", transition: "all 0.3s" }}
          >
            {/* Ubah ikon jadi silang kalau menu sedang terbuka */}
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </motion.nav>

      {/* ── DROPDOWN MENU MOBILE ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: 56, // Muncul persis di bawah Navbar
              left: 0,
              right: 0,
              background: "rgba(5,10,15,0.95)",
              borderBottom: `1px solid ${C.cyanDim}`,
              backdropFilter: "blur(10px)",
              zIndex: 99,
              display: "flex",
              flexDirection: "column",
              padding: "1rem 2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.8)"
            }}
          >
            {sections.map(s => (
              <a 
                key={s} 
                href={`#${s}`} 
                onClick={() => setIsOpen(false)} // Otomatis tutup menu kalau link diklik
                style={{ 
                  fontFamily: "monospace", 
                  fontSize: 14, 
                  color: C.cyan, 
                  textDecoration: "none", 
                  letterSpacing: 3,
                  padding: "1.2rem 0",
                  borderBottom: `1px solid ${C.greyMid}`,
                  textAlign: "center",
                  fontWeight: 600
                }}
              >
                [ {s} ]
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── SECTIONS ──────────────────────────────────────────────────────────────────
const techStack = [
  { module: "CORE.LANG", items: ["Python", "C++","",""] },
  { module: "AI.ENGINE", items: ["Scikit-learn", "OpenCV"] },
  { module: "IOT.PROTOCOL", items: ["HTTP", "MQTT"] },
  { module: "HW.BOARDS", items: ["Raspberry Pi 4", "ESP32", "Arduino"] },
  { module: "WEB.LAYER", items: ["React", "Node.js", "REST API", "Streamlit"] },
  { module: "DATA.CORE", items: ["MySQL", "InfluxDB", "Pandas"] },
  { module: "TOOLS.ENV", items: ["Git", "Docker", "Linux", "VS Code"] },
];

const missions = [
  {
    title: "Robotics Arm",
    description: "A versatile robotic arm equipped with multiple degrees of freedom",
    status: "PENDING",
    tags: ["ESP32", "Servo Motors"],
    image: imgRoboticArm,
  },
  {
    title: "Automatic Plant Watering System ",
    description: "An automated plant watering system using soil moisture sensors and an ESP32 microcontroller to maintain optimal hydration levels for indoor plants.",
    status: "COMPLETE",
    tags: ["ESP32"],
    image: imgWatering,
  },
  {
    title: "SERSAM Project",
    description: "An automated river cleaning system utilizing ultrasonic sensors and a motorized conveyor belt to detect and extract waterborne waste.",
    status: "COMPLETE",
    tags: ["ESP32", "Ultrasonic", "HTTP"],
    image: imgSersam,
  },
  {
    title: "Kopling: Smart Bin",
    description: "An AI-powered smart waste system that transforms everyday waste into circular economy assets, fully integrated with a mobile app ecosystem.",
    status: "COMPLETE",
    tags: ["Sensors", "Raspberry Pi 4", "MQTT", "Flutter App", "OpenCV"],
    image: imgKopling,
  },
  {
    title: "Smart Traffic Light",
    description: "Intelligent traffic light system with real-time adaptive control based on vehicle and pedestrian flow.",
    status: "COMPLETE",
    tags: ["Sensors", "ESP32CAM", "MySQL", "HTTP Server"],
    image: imgSmartTraffic,
  },
];

const labLog = [
  { year: "2026–NOW", title: "AI & Robotics", org: "Organization division", desc: "Assisting researchers with hardware prototyping, sensor calibration, and data pipeline automation for smart environment projects." },
  { year: "2026-NOW", title: "AI Instructor", org: "Teaching Instructor", desc: "Teaching artificial intelligence concepts and applications to undergraduate students." },
  { year: "2026-NOW", title: "Operating System Instructor", org: "Teaching Instructor", desc: "Teaching Operating System concepts and applications to undergraduate students." },
];

const contactList = [
  { 
    platform: "LINKEDIN", 
    value: "Abdurrokhman", 
    url: "https://www.linkedin.com/in/abdurrokhman-bin-ano/",
    icon: "IN" 
  },
  { 
    platform: "GITHUB", 
    value: "abdurrokhman02", 
    url: "https://github.com/abdurrokhman02", 
    icon: "GIT" 
  },
  { 
    platform: "WHATSAPP", 
    value: "Secure Chat", 
    url: "https://wa.me/", 
    icon: "WA" 
  },
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

  const [isMobile, setIsMobile] = useState(false);

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
      {/* ── HERO ── */}
      <section id="INIT" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 2rem 2rem", position: "relative" }}>
        
        {/* Panggil class CSS-nya di sini */}
        <div className="hero-container">
          
          {/* BAGIAN TEKS */}
          <motion.div className="hero-text-wrapper" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ fontSize: 11, letterSpacing: 5, color: C.cyanDim, textTransform: "uppercase", marginBottom: "1rem" }}>
              ◈ SYSTEM IDENTITY CONFIRMED
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: "1rem", letterSpacing: -1 }}>
              {"< INFORMATICS"}
              <br />
              <span style={{ color: C.cyan }}>STUDENT /&gt;</span>
            </motion.h1>

            <motion.div className="hero-divider" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.8 }} />

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
              style={{ fontSize: 15, color: C.textDim, lineHeight: 1.8, maxWidth: 520, marginBottom: "2rem" }}>
              Specializing in <span style={{ color: C.cyan }}>Artificial Intelligence</span> and <span style={{ color: C.green }}>Internet of Things</span>. Building smart systems that bridge the physical and digital world.
            </motion.p>

            {/* Tombol Aksi */}
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} style={{ gap: "1rem" }}>
              {[
                { label: "DOWNLOAD CV", href: cvFile, isDownload: true }, 
                { label: "VIEW MISSIONS", href: "#MISSIONS" },
                { label: "CONTACT", href: "#CONTACT" }
              ].map((btn, i) => (
                <motion.a 
                  key={btn.label} 
                  href={btn.href}
                  download={btn.isDownload ? "CV_Abdurrahman.pdf" : undefined}
                  onClick={(e) => {
                    if (btn.isDownload) {
                      const confirmDownload = window.confirm("Apakah Anda ingin mengunduh CV ini?");
                      if (!confirmDownload) e.preventDefault(); 
                    }
                  }}
                  whileHover={{ scale: 1.04, borderColor: C.cyan }} 
                  whileTap={{ scale: 0.97 }}
                  style={{ 
                    padding: "10px 20px", background: i === 0 ? C.cyan : "transparent", color: i === 0 ? C.bg : C.cyan, border: `1px solid ${C.cyan}`, 
                    fontSize: 11, letterSpacing: 3, cursor: "pointer", fontFamily: "monospace", fontWeight: 600, textDecoration: "none", display: "inline-block"
                  }}>
                  {btn.label}
                </motion.a>
              ))}
            </motion.div>

            {/* Status bar */}
            <motion.div className="hero-status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
              style={{ marginTop: "2rem", gap: "2rem", fontSize: 10, color: C.textDim, letterSpacing: 2 }}>
              {[["STATUS", "ONLINE"], ["MODE", "BUILD"], ["LAB", "ACTIVE"]].map(([k, v]) => (
                <div key={k}>{k}: <span style={{ color: C.cyan }}>{v}</span></div>
              ))}
            </motion.div>
          </motion.div>

          {/* BAGIAN FOTO HUD */}
          <motion.div className="hero-image-wrapper" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 1 }}>
            <ProfileHUD scrollY={scrollY} />
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginTop: "3rem", alignItems: "stretch" }}>
            {techStack.map((mod, i) => (
              <motion.div key={mod.module}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{ height: "100%" }} /* <-- KUNCI 1: Memaksa bungkus animasi merenggang */
              >
                <PlateBox 
                  label={mod.module} 
                  glowOnHover 
                  style={{ height: "100%", boxSizing: "border-box" }} /* <-- KUNCI 2: Memaksa PlateBox mengisi penuh ruang */
                >
                  {mod.items.map((item, index) => {
                    // <-- KUNCI 3: Mencegah render jika string kosong ("") atau cuma spasi (" ")
                    if (!item || item.trim() === "") return null; 
                    
                    return (
                      <div key={index} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: C.text }}>
                        <span style={{ color: C.cyan, fontSize: 8 }}>◆</span> {item}
                      </div>
                    );
                  })}
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

          {/* Tambah alignItems: "stretch" di baris ini */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginTop: "3rem", alignItems: "stretch" }}>
            {missions.map((mission, i) => (
              <motion.div key={mission.title}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ height: "100%" }} /* <-- Tambah height: 100% di sini */
              >
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

      {/* ── CONTACT ── */}
      <section id="CONTACT" style={{ padding: "6rem 2rem", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader label="05" title="SECURE.COMMS" subtitle="Establish a direct connection" />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginTop: "3rem", alignItems: "stretch" }}>
            {contactList.map((contact, i) => (
              <motion.div key={contact.platform}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ height: "100%" }}
              >
                {/* Bungkus dengan tag <a> agar bisa diklik */}
                <a href={contact.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", display: "block", height: "100%" }}>
                  <PlateBox glowOnHover style={{ height: "100%", display: "flex", alignItems: "center", gap: "1.5rem", cursor: "pointer", boxSizing: "border-box" }}>
                    
                    {/* Kotak Ikon */}
                    <div style={{ width: 50, height: 50, border: `1px solid ${C.cyanDim}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.cyan, fontFamily: "monospace", background: "rgba(0,245,255,0.05)" }}>
                      {contact.icon}
                    </div>
                    
                    {/* Teks Kontak */}
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: 3, color: C.cyanDim, marginBottom: 4 }}>{contact.platform}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.white, fontFamily: "monospace", letterSpacing: 1 }}>{contact.value}</div>
                    </div>

                  </PlateBox>
                </a>
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