import { motion } from "framer-motion";
import { ShieldCheck, ArrowUpRight, TrendingUp, ChevronRight } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

// Mini sparkline path for portfolio card
const SparkLine = ({ color = "#1DB954" }) => (
  <svg viewBox="0 0 80 32" className="w-20 h-8" fill="none">
    <path
      d="M0 28 L10 22 L20 24 L30 16 L40 18 L50 10 L60 12 L70 5 L80 3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M0 28 L10 22 L20 24 L30 16 L40 18 L50 10 L60 12 L70 5 L80 3 L80 32 L0 32 Z"
      fill={`${color}20`}
    />
  </svg>
);

// Gauge for risk card
const RiskGauge = () => (
  <svg viewBox="0 0 64 36" className="w-16 h-9" fill="none">
    <path d="M4 32 A28 28 0 0 1 60 32" stroke="#1e3a5f" strokeWidth="6" strokeLinecap="round" />
    <path d="M4 32 A28 28 0 0 1 32 4" stroke="#F5A623" strokeWidth="6" strokeLinecap="round" />
    <circle cx="32" cy="32" r="3" fill="#F5A623" />
    <line x1="32" y1="32" x2="32" y2="10" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function HeroPortfolioCard() {
  return (
    <motion.div
      className="glass rounded-card p-4 w-64"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-success/20 flex items-center justify-center">
            <TrendingUp size={14} className="text-success" />
          </div>
          <span className="text-white/70 text-xs font-medium">Portfolio Growth</span>
        </div>
        <span className="text-success text-xs font-mono-num font-semibold">+18.4%</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-white text-lg font-mono-num font-bold">₹24.6L</p>
          <p className="text-white/40 text-[11px]">Current Value</p>
        </div>
        <SparkLine />
      </div>
    </motion.div>
  );
}

function HeroSIPCard() {
  return (
    <motion.div
      className="glass rounded-card p-4 w-64"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
          <ArrowUpRight size={14} className="text-accent" />
        </div>
        <span className="text-white/70 text-xs font-medium">SIP Returns</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white/50 text-sm font-mono-num">₹5,000/mo</span>
        <ArrowUpRight size={14} className="text-success" />
        <span className="text-white font-mono-num font-bold text-base">₹12.4L</span>
      </div>
      <p className="text-white/40 text-[11px] mt-1.5">in 10 years @ 12% p.a.</p>
      <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-success rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "72%" }}
          transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

function HeroRiskCard() {
  return (
    <motion.div
      className="glass rounded-card p-4 w-64"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.0, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-warning/20 flex items-center justify-center">
            <ShieldCheck size={14} className="text-warning" />
          </div>
          <span className="text-white/70 text-xs font-medium">Risk Profile</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <RiskGauge />
        <div>
          <p className="text-warning font-bold text-base">Moderate</p>
          <p className="text-white/40 text-[11px]">Balanced growth</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-dark grid-texture flex flex-col">
      {/* Radial glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/8 rounded-full blur-[100px]" />
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-8 items-center">
          {/* Left content */}
          <div className="space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge icon={ShieldCheck} variant="white">
                SEBI Registered Investment Advisor
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
            >
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.12] tracking-tight">
                Your Wealth,{" "}
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
                  Grown With
                </span>{" "}
                Precision.
              </h1>
            </motion.div>

            <motion.p
              className="text-white/60 text-lg leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Expert-guided mutual funds, insurance, equity, and financial planning built around
              your goals, not commissions.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              <Link to="/calculators">
                <Button variant="accent" size="lg">
                  Calculate Your Savings
                  <ArrowUpRight size={16} />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="primary" size="lg">
                  Get Financial Plan
                </Button>
              </Link>
              <Link to="/contact#book">
                <Button variant="ghost" size="lg">
                  Book Consultation
                </Button>
              </Link>
            </motion.div>

            {/* Trust line */}
            <motion.div
              className="flex flex-wrap items-center gap-4 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {["10,000+ Clients", "₹500 Cr+ AUM", "15+ Years Experience"].map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="w-1 h-1 bg-white/25 rounded-full" />}
                  <span className="text-white/50 text-sm font-mono-num">{item}</span>
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right dashboard cards */}
          <div className="hidden lg:flex flex-col items-end gap-4 relative">
            <HeroPortfolioCard />
            <div className="ml-8">
              <HeroSIPCard />
            </div>
            <HeroRiskCard />
          </div>
        </div>
      </div>

      {/* Hint of next section */}
      <div className="w-full flex justify-center pb-6">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-white/25 text-xs">Scroll to explore</span>
          <ChevronRight size={16} className="text-white/25 rotate-90" />
        </motion.div>
      </div>
    </section>
  );
}
