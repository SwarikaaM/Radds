// import { motion, AnimatePresence } from "framer-motion";
// import { useEffect, useState, useRef } from "react";
// import { ShieldCheck, ArrowUpRight, TrendingUp, ChevronRight, Target, GraduationCap, Users, PiggyBank } from "lucide-react";
// import Badge from "../ui/Badge";
// import Button from "../ui/Button";
// import { Link } from "react-router-dom";

// // ─── Timing constants (seconds) ──────────────────────────────────────────────
// // Phase 1: 0s    — headline + CTAs appear
// // Phase 2: 1.2s  — phone shell rises
// // Phase 3: 2.0s  — phone header builds
// // Phase 4: 2.5s  — goal strips build one-by-one
// // Phase 5: 3.4s  — main wealth card appears
// // Phase 6: 4.0s  — action buttons row appears
// // Phase 7: 4.5s  — analytics / chart section appears
// // Phase 8: 5.2s  — phone zooms in
// // Phase 9: 6.0s  — left card 1 appears (icon badge)
// // Phase 10: 6.6s — left card 2 appears (retirement)
// // Phase 11: 7.2s — right card 1 appears (wealth gain)
// // Phase 12: 7.8s — right card 2 appears (families)
// // Phase 13: 9.5s — loop resets

// const LOOP_DURATION = 9500;

// // ─── Animated count-up ───────────────────────────────────────────────────────
// function CountUp({ to, active, duration = 2000, prefix = "₹", suffix = " Cr" }) {
//   const [val, setVal] = useState(0);
//   const raf = useRef(null);
//   useEffect(() => {
//     if (!active) { setVal(0); return; }
//     const start = performance.now();
//     const tick = (now) => {
//       const p = Math.min((now - start) / duration, 1);
//       const eased = 1 - Math.pow(1 - p, 3);
//       setVal(+(eased * to).toFixed(2));
//       if (p < 1) raf.current = requestAnimationFrame(tick);
//     };
//     raf.current = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(raf.current);
//   }, [active, to, duration]);
//   return <>{prefix}{val.toFixed(2)}{suffix}</>;
// }

// // ─── SVG compounding chart ────────────────────────────────────────────────────
// const CHART_LINE = "M0,90 C15,85 25,75 35,60 C45,45 50,35 60,22 C70,10 80,5 100,2";
// const CHART_FILL = CHART_LINE + " L100,100 L0,100 Z";

// function CompoundChart({ active }) {
//   return (
//     <svg viewBox="0 0 100 100" className="w-full h-16" preserveAspectRatio="none">
//       <defs>
//         <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor="#39C3EF" stopOpacity="0.4" />
//           <stop offset="100%" stopColor="#39C3EF" stopOpacity="0" />
//         </linearGradient>
//         <clipPath id="cc">
//           <motion.rect
//             x="0" y="0" height="100"
//             initial={{ width: 0 }}
//             animate={active ? { width: 100 } : { width: 0 }}
//             transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
//           />
//         </clipPath>
//       </defs>
//       <path d={CHART_FILL} fill="url(#cg)" clipPath="url(#cc)" />
//       <path d={CHART_LINE} stroke="#39C3EF" strokeWidth="2.5" fill="none" strokeLinecap="round" clipPath="url(#cc)" />
//     </svg>
//   );
// }

// // ─── The phone dashboard ──────────────────────────────────────────────────────
// function PhoneMock({ step }) {
//   const showShell    = step >= 2;
//   const showHeader   = step >= 3;
//   const showStrip1   = step >= 4;
//   const showStrip2   = step >= 4;
//   const showStrip3   = step >= 4;
//   const showMainCard = step >= 5;
//   const showButtons  = step >= 6;
//   const showChart    = step >= 7;
//   const chartActive  = step >= 7;
//   const zoomed       = step >= 8;

//   const STRIPS = [
//     { label: "Retirement Corpus", val: "₹4.2 Cr", bg: "#22c55e" },
//     { label: "Child Education",    val: "₹55L",    bg: "#eab308" },
//     { label: "Monthly SIP",        val: "₹15,000", bg: "#1a1a2e" },
//   ];

//   const BTNS = ["Retirement", "Education", "Tax Saving", "More"];

//   return (
//     <motion.div
//       animate={zoomed ? { scale: 1.13, y: -10 } : { scale: 1, y: 0 }}
//       transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
//       style={{ transformOrigin: "center top" }}
//     >
//       {/* Phone shell */}
//       <motion.div
//         className="relative overflow-hidden"
//         style={{
//           width: 260,
//           borderRadius: 28,
//           background: "#f8fafc",
//           border: "1px solid rgba(0,0,0,0.08)",
//           boxShadow: "0 32px 80px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.12)",
//           minHeight: 460,
//         }}
//         initial={{ opacity: 0, y: 120 }}
//         animate={showShell ? { opacity: 1, y: 0 } : { opacity: 0, y: 120 }}
//         transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
//       >
//         {/* Status bar */}
//         <div className="flex items-center justify-between px-5 pt-3 pb-1">
//           <span style={{ fontSize: 10, color: "#334155", fontFamily: "monospace" }}>9:41</span>
//           <div className="flex items-center gap-1">
//             <div className="w-3 h-1.5 rounded-sm bg-slate-400" />
//             <div className="w-1 h-1.5 rounded-sm bg-slate-300" />
//             <div className="w-4 h-2 rounded-sm bg-slate-800 ml-0.5" />
//           </div>
//         </div>

//         {/* Header row */}
//         <motion.div
//           className="flex items-center justify-between px-4 py-2"
//           initial={{ opacity: 0, y: 8 }}
//           animate={showHeader ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
//           transition={{ duration: 0.4 }}
//         >
//           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
//             <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>RC</span>
//           </div>
//           <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Your Portfolio</span>
//           <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
//             <TrendingUp size={13} className="text-slate-500" />
//           </div>
//         </motion.div>

//         {/* Stacked goal strips */}
//         <div className="px-3 space-y-0.5">
//           {STRIPS.map((s, i) => (
//             <motion.div
//               key={s.label}
//               className="flex items-center justify-between px-3 py-2 rounded-lg"
//               style={{ background: s.bg, opacity: 0.95 }}
//               initial={{ opacity: 0, x: -12 }}
//               animate={
//                 (i === 0 && showStrip1) || (i === 1 && showStrip2) || (i === 2 && showStrip3)
//                   ? { opacity: 1, x: 0 }
//                   : { opacity: 0, x: -12 }
//               }
//               transition={{ delay: i * 0.18, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
//             >
//               <span style={{ fontSize: 10, color: i === 2 ? "#94a3b8" : "rgba(0,0,0,0.65)", fontWeight: 500 }}>{s.label}</span>
//               <span style={{ fontSize: 10, color: i === 2 ? "#e2e8f0" : "rgba(0,0,0,0.75)", fontWeight: 700, fontFamily: "monospace" }}>{s.val}</span>
//             </motion.div>
//           ))}
//         </div>

//         {/* Main wealth card */}
//         <motion.div
//           className="mx-3 mt-2 rounded-2xl p-4"
//           style={{ background: "linear-gradient(135deg, #22568f 0%, #2389af 100%)" }}
//           initial={{ opacity: 0, y: 14 }}
//           animate={showMainCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
//           transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
//         >
//           <div className="flex items-start justify-between mb-1">
//             <p style={{ fontSize: 9, color: "rgba(255,255,255,0.65)" }}>Projected Wealth</p>
//             <span style={{ fontSize: 8, color: "#86efac", background: "rgba(134,239,172,0.15)", borderRadius: 4, padding: "1px 5px", fontWeight: 600 }}>+274%</span>
//           </div>
//           <p style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "monospace", lineHeight: 1.1 }}>
//             {chartActive
//               ? <CountUp to={1.01} active={chartActive} duration={2200} prefix="₹" suffix=" Cr" />
//               : "₹1.01 Cr"}
//           </p>
//           <div className="flex gap-3 mt-2">
//             <div>
//               <p style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>Invested</p>
//               <p style={{ fontSize: 11, color: "#fff", fontWeight: 700, fontFamily: "monospace" }}>₹27L</p>
//             </div>
//             <div>
//               <p style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>Gain</p>
//               <p style={{ fontSize: 11, color: "#86efac", fontWeight: 700, fontFamily: "monospace" }}>+₹74L</p>
//             </div>
//             <div>
//               <p style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>Rate</p>
//               <p style={{ fontSize: 11, color: "#fff", fontWeight: 700, fontFamily: "monospace" }}>15% p.a.</p>
//             </div>
//           </div>
//         </motion.div>

//         {/* Action buttons row */}
//         <motion.div
//           className="grid grid-cols-4 gap-1.5 px-3 mt-2"
//           initial={{ opacity: 0, y: 8 }}
//           animate={showButtons ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
//           transition={{ duration: 0.4 }}
//         >
//           {BTNS.map((b, i) => (
//             <motion.div
//               key={b}
//               className="flex flex-col items-center gap-1 py-2 rounded-xl"
//               style={{ background: "#f1f5f9" }}
//               initial={{ opacity: 0, scale: 0.85 }}
//               animate={showButtons ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
//               transition={{ delay: i * 0.07, duration: 0.3 }}
//             >
//               <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center">
//                 <TrendingUp size={10} className="text-primary" />
//               </div>
//               <span style={{ fontSize: 8, color: "#334155", fontWeight: 500 }}>{b}</span>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Chart section */}
//         <motion.div
//           className="mx-3 mt-2 mb-3 rounded-xl overflow-hidden"
//           style={{ background: "#f1f5f9" }}
//           initial={{ opacity: 0, y: 10 }}
//           animate={showChart ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="flex justify-between items-center px-3 pt-2">
//             <span style={{ fontSize: 8, color: "#64748b", fontWeight: 600 }}>↑ COMPOUNDING GROWTH</span>
//             <span style={{ fontSize: 8, color: "#22c55e", fontWeight: 700 }}>15 Years</span>
//           </div>
//           <div className="px-2 pb-1">
//             <CompoundChart active={chartActive} />
//           </div>
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// }

// // ─── Satellite card wrapper ───────────────────────────────────────────────────
// function SatCard({ visible, delay = 0, from = "left", className = "", children }) {
//   const xStart = from === "left" ? -28 : 28;
//   return (
//     <motion.div
//       className={`rounded-2xl overflow-hidden ${className}`}
//       style={{
//         background: "#ffffff",
//         boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
//         border: "1px solid rgba(0,0,0,0.06)",
//       }}
//       initial={{ opacity: 0, x: xStart, y: 10 }}
//       animate={visible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: xStart, y: 10 }}
//       transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//     >
//       {children}
//     </motion.div>
//   );
// }

// // Mini sparkline path for portfolio card
// const SparkLine = ({ color = "#1DB954" }) => (
//   <svg viewBox="0 0 80 32" className="w-20 h-8" fill="none">
//     <path
//       d="M0 28 L10 22 L20 24 L30 16 L40 18 L50 10 L60 12 L70 5 L80 3"
//       stroke={color}
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       fill="none"
//     />
//     <path
//       d="M0 28 L10 22 L20 24 L30 16 L40 18 L50 10 L60 12 L70 5 L80 3 L80 32 L0 32 Z"
//       fill={`${color}20`}
//     />
//   </svg>
// );

// // Gauge for risk card
// const RiskGauge = () => (
//   <svg viewBox="0 0 64 36" className="w-16 h-9" fill="none">
//     <path d="M4 32 A28 28 0 0 1 60 32" stroke="#1e3a5f" strokeWidth="6" strokeLinecap="round" />
//     <path d="M4 32 A28 28 0 0 1 32 4" stroke="#F5A623" strokeWidth="6" strokeLinecap="round" />
//     <circle cx="32" cy="32" r="3" fill="#F5A623" />
//     <line x1="32" y1="32" x2="32" y2="10" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
//   </svg>
// );

// function HeroPortfolioCard() {
//   return (
//     <motion.div
//       className="glass rounded-card p-4 w-64"
//       initial={{ opacity: 0, x: 30 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
//       whileHover={{ y: -3, transition: { duration: 0.2 } }}
//     >
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-2">
//           <div className="w-7 h-7 rounded-lg bg-success/20 flex items-center justify-center">
//             <TrendingUp size={14} className="text-success" />
//           </div>
//           <span className="text-white/70 text-xs font-medium">Portfolio Growth</span>
//         </div>
//         <span className="text-success text-xs font-mono-num font-semibold">+18.4%</span>
//       </div>
//       <div className="flex items-end justify-between">
//         <div>
//           <p className="text-white text-lg font-mono-num font-bold">₹24.6L</p>
//           <p className="text-white/40 text-[11px]">Current Value</p>
//         </div>
//         <SparkLine />
//       </div>
//     </motion.div>
//   );
// }

// function HeroSIPCard() {
//   return (
//     <motion.div
//       className="glass rounded-card p-4 w-64"
//       initial={{ opacity: 0, x: 30 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
//       whileHover={{ y: -3, transition: { duration: 0.2 } }}
//     >
//       <div className="flex items-center gap-2 mb-3">
//         <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
//           <ArrowUpRight size={14} className="text-accent" />
//         </div>
//         <span className="text-white/70 text-xs font-medium">SIP Returns</span>
//       </div>
//       <div className="flex items-center gap-2">
//         <span className="text-white/50 text-sm font-mono-num">₹5,000/mo</span>
//         <ArrowUpRight size={14} className="text-success" />
//         <span className="text-white font-mono-num font-bold text-base">₹12.4L</span>
//       </div>
//       <p className="text-white/40 text-[11px] mt-1.5">in 10 years @ 12% p.a.</p>
//       <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
//         <motion.div
//           className="h-full bg-gradient-to-r from-accent to-success rounded-full"
//           initial={{ width: 0 }}
//           animate={{ width: "72%" }}
//           transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
//         />
//       </div>
//     </motion.div>
//   );
// }

// function HeroRiskCard() {
//   return (
//     <motion.div
//       className="glass rounded-card p-4 w-64"
//       initial={{ opacity: 0, x: 30 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ delay: 1.0, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
//       whileHover={{ y: -3, transition: { duration: 0.2 } }}
//     >
//       <div className="flex items-center justify-between mb-2">
//         <div className="flex items-center gap-2">
//           <div className="w-7 h-7 rounded-lg bg-warning/20 flex items-center justify-center">
//             <ShieldCheck size={14} className="text-warning" />
//           </div>
//           <span className="text-white/70 text-xs font-medium">Risk Profile</span>
//         </div>
//       </div>
//       <div className="flex items-center gap-4">
//         <RiskGauge />
//         <div>
//           <p className="text-warning font-bold text-base">Moderate</p>
//           <p className="text-white/40 text-[11px]">Balanced growth</p>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// // ─── Step timestamps (ms from loop start) ────────────────────────────────────
// const STEP_TIMES = [0, 1200, 2000, 2500, 3400, 4000, 4500, 5200, 6000, 6600, 7200, 7800];

// export default function HeroSection() {
//   const [step, setStep] = useState(1);
//   const [key, setKey]   = useState(0); // forces re-mount on loop

//   useEffect(() => {
//     const timers = STEP_TIMES.slice(1).map((t, i) =>
//       setTimeout(() => setStep(i + 2), t)
//     );
//     // Loop reset
//     const loopTimer = setTimeout(() => {
//       setStep(1);
//       setKey(k => k + 1);
//     }, LOOP_DURATION);
//     return () => { timers.forEach(clearTimeout); clearTimeout(loopTimer); };
//   }, [key]);

//   const showLeftCard1  = step >= 9;
//   const showLeftCard2  = step >= 10;
//   const showRightCard1 = step >= 11;
//   const showRightCard2 = step >= 12;

//   return (
//     <section className="relative min-h-screen bg-dark grid-texture flex flex-col overflow-hidden">
//       {/* Ambient glows */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
//         <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-secondary/8 rounded-full blur-[80px]" />
//       </div>

//       <div className="flex-1 flex flex-col items-center justify-start pt-20 pb-12 px-4 sm:px-6 w-full">

//         {/* ── TOP: Headline centered ─────────────────────────────────────── */}
//         <div className="text-center space-y-5 mb-10 max-w-2xl">
//           <motion.div
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.55 }}
//           >
//             <Badge icon={ShieldCheck} variant="white">
//               AMFI-Registered Mutual Fund Distributor
//             </Badge>
//           </motion.div>

//           <motion.h1
//             className="font-playfair text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-white leading-[1.1] tracking-tight"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.18, duration: 0.65 }}
//           >
//             Small Steps,{" "}
//             <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
//               Extraordinary
//             </span>{" "}
//             Wealth.
//           </motion.h1>

//           <motion.p
//             className="text-white/55 text-base md:text-lg leading-relaxed"
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.32, duration: 0.6 }}
//           >
//             Disciplined SIP investing + time + compounding = life-changing wealth.
//             Expert advisors, not algorithms.
//           </motion.p>

//           <motion.div
//             className="flex flex-wrap justify-center gap-3"
//             initial={{ opacity: 0, y: 14 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.46, duration: 0.55 }}
//           >
//             <Link to="/calculators">
//               <Button variant="accent" size="lg">
//                 Calculate Your Savings
//                 <ArrowUpRight size={16} />
//               </Button>
//             </Link>
//             <Link to="/contact">
//               <Button variant="primary" size="lg">
//                 Get Financial Plan
//               </Button>
//             </Link>
//           </motion.div>

//           <motion.div
//             className="flex flex-wrap justify-center items-center gap-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.62, duration: 0.5 }}
//           >
//             {["100+ Families", "₹200 Cr+ Distributed", "8+ Years"].map((item, i) => (
//               <span key={i} className="flex items-center gap-2">
//                 {i > 0 && <span className="w-1 h-1 bg-white/25 rounded-full" />}
//                 <span className="text-white/45 text-sm font-mono-num">{item}</span>
//               </span>
//             ))}
//           </motion.div>
//         </div>

//         {/* ── BOTTOM: Phone + satellite cards ───────────────────────────── */}
//         <div className="hidden lg:flex items-center justify-center gap-6 w-full max-w-5xl relative" key={key}>

//           {/* LEFT cards column */}
//           <div className="flex flex-col gap-4 w-52 items-end">
//             {/* Card 1 — SEBI badge */}
//             <SatCard visible={showLeftCard1} delay={0} from="left" className="p-3 w-44">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
//                   <ShieldCheck size={18} className="text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-xs font-semibold text-slate-800">SEBI Registered</p>
//                   <p className="text-[10px] text-slate-500 leading-tight">Certified advisor, fully regulated</p>
//                 </div>
//               </div>
//             </SatCard>

//             {/* Card 2 — Retirement goal */}
//             <SatCard visible={showLeftCard2} delay={0} from="left" className="p-4 w-48">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="w-7 h-7 rounded-lg bg-success/15 flex items-center justify-center">
//                   <Target size={13} className="text-success" />
//                 </div>
//                 <span className="text-[11px] font-semibold text-slate-600">Retirement Goal</span>
//               </div>
//               <p className="text-xl font-bold text-slate-900 font-mono-num">₹4.2 Cr</p>
//               <div className="flex items-center gap-1.5 mt-2">
//                 <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
//                   <div className="h-full w-[92%] rounded-full" style={{ background: "#22c55e" }} />
//                 </div>
//                 <span className="text-[10px] font-bold" style={{ color: "#22c55e" }}>92%</span>
//               </div>
//               <p className="text-[10px] text-slate-400 mt-1">On Track</p>
//             </SatCard>
//           </div>

//           {/* CENTER — phone */}
//           <PhoneMock step={step} />

//           {/* RIGHT cards column */}
//           <div className="flex flex-col gap-4 w-52 items-start">
//             {/* Card 1 — Wealth gain */}
//             <SatCard visible={showRightCard1} delay={0} from="right" className="p-4 w-48">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#fef3c7" }}>
//                   <TrendingUp size={13} style={{ color: "#d97706" }} />
//                 </div>
//                 <span className="text-[11px] font-semibold text-slate-600">Wealth Gain</span>
//               </div>
//               <p className="text-xl font-bold font-mono-num" style={{ color: "#d97706" }}>₹74 Lakhs</p>
//               <p className="text-[10px] text-slate-400 mt-1">Generated Through Compounding</p>
//             </SatCard>

//             {/* Card 2 — Families guided */}
//             <SatCard visible={showRightCard2} delay={0} from="right" className="p-4 w-48" >
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
//                   <Users size={13} className="text-accent" />
//                 </div>
//                 <span className="text-[11px] font-semibold text-slate-600">Families Guided</span>
//               </div>
//               <p className="text-xl font-bold text-slate-900 font-mono-num">500+</p>
//               <p className="text-[10px] text-slate-400 mt-1">Monthly SIP ₹15,000 · 15 yrs</p>
//             </SatCard>
//           </div>
//         </div>

//         {/* Mobile: phone only */}
//         <div className="flex lg:hidden justify-center w-full" key={`m-${key}`}>
//           <PhoneMock step={step} />
//         </div>
//       </div>

//       {/* Scroll hint */}
//       <div className="w-full flex justify-center pb-5">
//         <motion.div
//           animate={{ y: [0, 6, 0] }}
//           transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
//           className="flex flex-col items-center gap-1"
//         >
//           <span className="text-white/20 text-xs">Scroll to explore</span>
//           <ChevronRight size={15} className="text-white/20 rotate-90" />
//         </motion.div>
//       </div>
//     </section>
//   );
// }



import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ShieldCheck, ArrowUpRight, TrendingUp, ChevronRight, Target, GraduationCap, Users, Home, Plane } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

// ─── Animated count-up hook ───────────────────────────────────────────────────
function useCountUp(target, active, duration = 2000) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, duration]);
  return val;
}

// ─── Format Indian numbers ────────────────────────────────────────────────────
function fmtINR(n) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(0)} L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

// ─── Single dream stat card ───────────────────────────────────────────────────
function DreamStat({ icon: Icon, iconColor, iconBg, label, sublabel, target, suffix = "", delay, active }) {
  const val = useCountUp(target, active, 2200);
  return (
    <motion.div
      className="glass rounded-2xl p-4 flex items-center gap-4"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/50 text-[11px] font-medium mb-0.5">{label}</p>
        <p className="text-white font-mono-num font-bold text-lg leading-tight">
          {fmtINR(val)}{suffix}
        </p>
        <p className="text-white/35 text-[10px] mt-0.5">{sublabel}</p>
      </div>
    </motion.div>
    
  );
}



// ─── Progress bar milestone ───────────────────────────────────────────────────
function MilestoneBar({ label, pct, color, delay, active }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-white/55 text-[11px]">{label}</span>
        <span className="text-white/70 text-[11px] font-mono-num font-semibold">{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={active ? { width: `${pct}%` } : { width: 0 }}
          transition={{ delay: delay + 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}

// ─── Compounding chart SVG ────────────────────────────────────────────────────
const CHART_LINE = "M0,90 C15,85 25,75 35,60 C45,45 50,35 60,22 C70,10 80,5 100,2";
const CHART_FILL = CHART_LINE + " L100,100 L0,100 Z";

function CompoundChart({ active }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#39C3EF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#39C3EF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="cc2">
          <motion.rect
            x="0" y="0" height="100"
            initial={{ width: 0 }}
            animate={active ? { width: 100 } : { width: 0 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          />
        </clipPath>
      </defs>
      <path d={CHART_FILL} fill="url(#cg2)" clipPath="url(#cc2)" />
      <path d={CHART_LINE} stroke="#39C3EF" strokeWidth="2.5" fill="none" strokeLinecap="round" clipPath="url(#cc2)" />
    </svg>
  );
}

// ─── Phone mock (right side assembly animation) ───────────────────────────────
const LOOP_MS = 9500;
const STEP_MS = [0, 1200, 2000, 2500, 3400, 4000, 4500, 5200, 6000, 6600, 7200, 7800];
const STRIPS = [
  { label: "Retirement Corpus", val: "₹4.2 Cr",  bg: "#16a34a" },
  { label: "Child Education",   val: "₹55 L",    bg: "#ca8a04" },
  { label: "Monthly SIP",       val: "₹15,000",  bg: "#1e293b" },
];
const BTNS = ["Retirement", "Education", "Tax Saving", "More"];

function PhoneAssembly({ step }) {
  const showShell    = step >= 2;
  const showHeader   = step >= 3;
  const showStrips   = step >= 4;
  const showMainCard = step >= 5;
  const showBtns     = step >= 6;
  const showChart    = step >= 7;
  const zoomed       = step >= 8;

  const wealthVal = useCountUp(101, showChart, 2400); // in lakhs, shown as Cr

  return (
    <div className="relative flex items-center justify-center">


      {/* Phone shell */}
      <motion.div
        animate={zoomed ? { scale: 1.1, y: -8 } : { scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "center top" }}
      >
        <motion.div
          style={{
            width: 248,
            borderRadius: 28,
            background: "#f8fafc",
            border: "1.5px solid rgba(0,0,0,0.09)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.1)",
            minHeight: 450,
            overflow: "hidden",
          }}
          initial={{ opacity: 0, y: 110 }}
          animate={showShell ? { opacity: 1, y: 0 } : { opacity: 0, y: 110 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-1">
            <span style={{ fontSize: 10, color: "#334155", fontFamily: "monospace" }}>9:41</span>
            <div className="flex items-center gap-0.5">
              {[3,2,1].map(h => (
                <div key={h} className="w-0.5 rounded-sm bg-slate-400" style={{ height: h * 3 + 2 }} />
              ))}
              <div className="w-3 h-2 rounded-sm bg-slate-800 ml-1" />
            </div>
          </div>

          {/* App header */}
          <motion.div
            className="flex items-center justify-between px-4 py-2"
            initial={{ opacity: 0, y: 8 }}
            animate={showHeader ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span style={{ fontSize: 10, color: "#fff", fontWeight: 800 }}>RC</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Your Portfolio</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
              <TrendingUp size={12} className="text-slate-500" />
            </div>
          </motion.div>

          {/* Goal strips */}
          <div className="px-3 space-y-0.5">
            {STRIPS.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ background: s.bg }}
                initial={{ opacity: 0, x: -10 }}
                animate={showStrips ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ delay: i * 0.15, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                <span style={{ fontSize: 10, color: i === 2 ? "#94a3b8" : "rgba(0,0,0,0.6)", fontWeight: 500 }}>{s.label}</span>
                <span style={{ fontSize: 10, color: i === 2 ? "#e2e8f0" : "rgba(0,0,0,0.75)", fontWeight: 700, fontFamily: "monospace" }}>{s.val}</span>
              </motion.div>
            ))}
          </div>

          {/* Main wealth card */}
          <motion.div
            className="mx-3 mt-2 rounded-2xl p-4"
            style={{ background: "linear-gradient(135deg,#22568f,#2389af)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={showMainCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex justify-between items-start mb-1">
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.6)" }}>Projected Wealth</p>
              <span style={{ fontSize: 8, color: "#86efac", background: "rgba(134,239,172,0.18)", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>+274%</span>
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#fff", fontFamily: "monospace", lineHeight: 1.1 }}>
              ₹{(wealthVal / 100).toFixed(2)} Cr
            </p>
            <div className="flex gap-4 mt-2">
              <div><p style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>Invested</p><p style={{ fontSize: 11, color: "#fff", fontWeight: 700, fontFamily: "monospace" }}>₹27L</p></div>
              <div><p style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>Gain</p><p style={{ fontSize: 11, color: "#86efac", fontWeight: 700, fontFamily: "monospace" }}>+₹74L</p></div>
              <div><p style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>Rate</p><p style={{ fontSize: 11, color: "#fff", fontWeight: 700, fontFamily: "monospace" }}>15% p.a.</p></div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="grid grid-cols-4 gap-1.5 px-3 mt-2"
            initial={{ opacity: 0, y: 8 }}
            animate={showBtns ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.38 }}
          >
            {BTNS.map((b, i) => (
              <motion.div
                key={b}
                className="flex flex-col items-center gap-1 py-2 rounded-xl"
                style={{ background: "#f1f5f9" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={showBtns ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.07, duration: 0.28 }}
              >
                <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center">
                  <TrendingUp size={10} className="text-primary" />
                </div>
                <span style={{ fontSize: 7.5, color: "#334155", fontWeight: 500 }}>{b}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Chart */}
          <motion.div
            className="mx-3 mt-2 mb-3 rounded-xl overflow-hidden"
            style={{ background: "#f1f5f9" }}
            initial={{ opacity: 0, y: 8 }}
            animate={showChart ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex justify-between items-center px-3 pt-2">
              <span style={{ fontSize: 8, color: "#64748b", fontWeight: 600 }}>↑ COMPOUNDING GROWTH</span>
              <span style={{ fontSize: 8, color: "#16a34a", fontWeight: 700 }}>15 Years</span>
            </div>
            <div className="px-2 pb-1">
              <CompoundChart active={showChart} />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      
    </div>
  );
}

// ─── Satellite card ───────────────────────────────────────────────────────────
function SatCard({ visible, from = "left", children, extraClass = "" }) {
  const xStart = from === "left" ? -28 : 28;
  return (
    <motion.div
      className={`rounded-2xl overflow-hidden ${extraClass}`}
      style={{
        background: "#fff",
        boxShadow: "0 8px 28px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07)",
        border: "1px solid rgba(0,0,0,0.07)",
      }}
      initial={{ opacity: 0, x: xStart, y: 10 }}
      animate={visible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: xStart, y: 10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Phone + satellite cards (step driven, loops via key) ─────────────────────
function PhoneWithSatellites({ loopKey }) {
  const [step, setStep] = useState(1);
  useEffect(() => {
    setStep(1);
    const timers = STEP_MS.slice(1).map((t, i) =>
      setTimeout(() => setStep(i + 2), t)
    );
    return () => timers.forEach(clearTimeout);
  }, [loopKey]);

  const showLC1 = step >= 9;
  const showLC2 = step >= 10;
  const showRC1 = step >= 11;
  const showRC2 = step >= 12;

  return (
    <div className="relative flex items-center justify-center gap-6">
      {/* Left satellite cards */}
      <div className="flex flex-col gap-4 w-52 items-end">
        <SatCard visible={showLC1} from="left" extraClass="p-3 w-44">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-800">SEBI Registered</p>
              <p className="text-[9px] text-slate-400 leading-tight">Certified & regulated</p>
            </div>
          </div>
        </SatCard>
        <SatCard visible={showLC2} from="left" extraClass="p-3.5 w-44">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center">
              <Target size={12} className="text-green-600" />
            </div>
            <span className="text-[10px] font-semibold text-slate-600">Retirement Goal</span>
          </div>
          <p className="text-lg font-bold text-slate-900 font-mono-num">₹4.2 Cr</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-green-500" style={{ width: "92%" }} />
            </div>
            <span className="text-[9px] font-bold text-green-600">92%</span>
          </div>
          <p className="text-[9px] text-slate-400 mt-0.5">On Track</p>
        </SatCard>
      </div>

      {/* Phone */}
      <PhoneAssembly step={step} />

      {/* Right satellite cards */}
      <div className="flex flex-col gap-4 w-52 items-start">
        <SatCard visible={showRC1} from="right" extraClass="p-3.5 w-44">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center">
              <TrendingUp size={12} className="text-amber-600" />
            </div>
            <span className="text-[10px] font-semibold text-slate-600">Wealth Gain</span>
          </div>
          <p className="text-lg font-bold font-mono-num text-amber-600">₹74 Lakhs</p>
          <p className="text-[9px] text-slate-400 mt-0.5">Through Compounding</p>
        </SatCard>
        <SatCard visible={showRC2} from="right" extraClass="p-3.5 w-44">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users size={12} className="text-accent" />
            </div>
            <span className="text-[10px] font-semibold text-slate-600">Families Guided</span>
          </div>
          <p className="text-lg font-bold text-slate-900 font-mono-num">500+</p>
          <p className="text-[9px] text-slate-400 mt-0.5">SIP ₹15K · 15 yrs</p>
        </SatCard>
      </div>
    </div>
  );
}

// ─── LEFT: Dream number stats ─────────────────────────────────────────────────
const DREAM_STATS = [
  { icon: Home,         iconColor: "#39C3EF", iconBg: "rgba(57,195,239,0.12)", label: "Dream Home in 10 Years",       sublabel: "₹10K/mo SIP @ 14% returns",       target: 2300000  },
  { icon: GraduationCap,iconColor: "#1DB954", iconBg: "rgba(29,185,84,0.12)",  label: "Child's Education in 15 Years",sublabel: "₹8K/mo SIP @ 13% returns",        target: 5500000  },
  { icon: Plane,        iconColor: "#F5A623", iconBg: "rgba(245,166,35,0.12)", label: "Retirement Corpus at 60",      sublabel: "₹15K/mo SIP @ 15% for 25 yrs",   target: 42000000 },
  { icon: TrendingUp,   iconColor: "#a78bfa", iconBg: "rgba(167,139,250,0.12)",label: "Wealth Gained via Compounding",sublabel: "On ₹27L invested over 15 years",  target: 7400000  },
];

const MILESTONES = [
  { label: "Retirement Goal",    pct: 92, color: "#1DB954" },
  { label: "Child Education",    pct: 67, color: "#39C3EF" },
  { label: "Emergency Fund",     pct: 100, color: "#F5A623" },
];

export default function HeroSection() {
  const [loopKey, setLoopKey] = useState(0);
  const [statsActive, setStatsActive] = useState(false);

  useEffect(() => {
    // Activate count-ups after a brief delay
    const t = setTimeout(() => setStatsActive(true), 600);
    // Loop the phone animation
    const loop = setInterval(() => setLoopKey(k => k + 1), LOOP_MS);
    return () => { clearTimeout(t); clearInterval(loop); };
  }, []);

  return (
    <section className="relative min-h-screen bg-dark grid-texture flex flex-col overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-secondary/8 rounded-full blur-[90px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[80px]" />
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex items-center w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT: Dream numbers ──────────────────────────────────────── */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <Badge icon={ShieldCheck} variant="white">
                AMFI-Registered Mutual Fund Distributor
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.65 }}
            >
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-[3.1rem] font-bold text-white leading-[1.1] tracking-tight">
                Your Dream Life{" "}
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
                  Has a Number.
                </span>
                <br />Let's Hit It.
              </h1>
            </motion.div>

            <motion.p
              className="text-white/55 text-base leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
            >
              A ₹10,000/month SIP today becomes a crore tomorrow.
              See exactly what disciplined investing does to your future — no jargon, just numbers.
            </motion.p>

            {/* Dream stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DREAM_STATS.map((s, i) => (
                <DreamStat key={s.label} {...s} delay={0.35 + i * 0.12} active={statsActive} />
              ))}
            </div>

            <motion.p
              className="text-white/30 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              * Illustrative projections only. Mutual Fund investments are subject to market risks.
            </motion.p>

            {/* Goal milestones */}
            {/* <motion.div
              className="glass rounded-2xl p-4 space-y-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.55 }}
            >
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Client Goal Progress</p>
              {MILESTONES.map((m, i) => (
                <MilestoneBar key={m.label} {...m} delay={0.9 + i * 0.15} active={statsActive} />
              ))}
            </motion.div> */}

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <Link to="/calculators">
                <Button variant="accent" size="lg">
                  Calculate My Number
                  <ArrowUpRight size={16} />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="primary" size="lg">
                  Book Free Consultation
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.5 }}
            >
              {["100+ Families", "₹200 Cr+ Distributed", "8+ Years"].map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="w-1 h-1 bg-white/25 rounded-full" />}
                  <span className="text-white/40 text-sm font-mono-num">{item}</span>
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Phone assembly animation ─────────────────────────── */}
          <div className="hidden lg:flex items-center justify-center">
            <PhoneWithSatellites loopKey={loopKey} />
          </div>

          {/* Mobile: phone below content */}
          <div className="flex lg:hidden justify-center">
            <PhoneWithSatellites loopKey={loopKey} />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="w-full flex justify-center pb-5">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-white/20 text-xs">Scroll to explore</span>
          <ChevronRight size={15} className="text-white/20 rotate-90" />
        </motion.div>
      </div>
    </section>
  );
}
