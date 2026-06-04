import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

function PhoneMockup() {
  return (
    <motion.div
      className="relative mx-auto"
      style={{ width: 200, height: 400 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Phone shell */}
      <div
        className="absolute inset-0 rounded-[36px] border-2 border-white/20 bg-gradient-to-b from-white/10 to-white/5"
        style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)" }}
      />
      {/* Screen */}
      <div className="absolute inset-[3px] rounded-[34px] overflow-hidden bg-[#0D1B2E]">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2">
          <span className="text-white/50 text-[9px] font-mono-num">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 rounded-sm border border-white/40 relative">
              <div className="absolute inset-[1px] left-[1px] right-[3px] bg-white/60 rounded-[1px]" />
            </div>
          </div>
        </div>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#0D1B2E] rounded-b-2xl z-10" />

        {/* App content */}
        <div className="px-4 pt-2 space-y-3">
          {/* Mini logo bar */}
          <div className="flex items-center justify-between">
            <span className="text-white font-playfair font-bold text-xs">Radds <span className="text-accent">Capital</span></span>
            <div className="w-5 h-5 rounded-full bg-primary/30 border border-primary/40" />
          </div>

          {/* Portfolio card */}
          <div className="rounded-xl bg-gradient-to-br from-primary/40 to-secondary/30 border border-white/10 p-3">
            <p className="text-white/50 text-[9px] mb-0.5">Total Portfolio Value</p>
            <p className="text-white font-bold font-mono-num text-base">₹24,60,000</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <span className="text-success text-[9px] font-mono-num">+18.4% this year</span>
            </div>
            {/* Mini sparkline */}
            <svg viewBox="0 0 120 28" className="w-full h-6 mt-2" fill="none">
              <path d="M0 24 L15 20 L30 22 L45 14 L60 16 L75 8 L90 10 L105 4 L120 2"
                stroke="#39C3EF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M0 24 L15 20 L30 22 L45 14 L60 16 L75 8 L90 10 L105 4 L120 2 L120 28 L0 28 Z"
                fill="rgba(57,195,239,0.15)" />
            </svg>
          </div>

          {/* SIP card */}
          <div className="rounded-xl border border-white/8 bg-white/5 p-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-white/60 text-[9px]">Monthly SIP</p>
              <span className="text-success text-[9px] font-mono-num">Active</span>
            </div>
            <p className="text-white font-semibold font-mono-num text-sm">₹5,000 / mo</p>
            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-success rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "68%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-white/30 text-[8px] mt-1 font-mono-num">68% to goal</p>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-1.5">
            {["SIP", "Calculator", "Profile"].map((label, i) => (
              <div key={i} className="rounded-lg bg-white/5 border border-white/8 py-2 flex flex-col items-center gap-1">
                <div className="w-4 h-4 rounded bg-primary/30" />
                <span className="text-white/40 text-[8px]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side buttons */}
      <div className="absolute right-0 top-16 w-[3px] h-10 bg-white/20 rounded-l-sm" />
      <div className="absolute left-0 top-14 w-[3px] h-7 bg-white/20 rounded-r-sm" />
      <div className="absolute left-0 top-24 w-[3px] h-7 bg-white/20 rounded-r-sm" />

      {/* Reflection */}
      <div className="absolute inset-[3px] rounded-[34px] bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
}

function StoreBadge({ store, initial }) {
  const isAndroid = store === "android";

  return (
    <motion.a
      href="#"
      className="group flex items-center gap-3 bg-white/8 hover:bg-white/12 border border-white/15 hover:border-white/30 rounded-xl px-5 py-3.5 transition-all duration-200"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: initial, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      {isAndroid ? (
        <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none">
          <path d="M3.18 23.76a2 2 0 0 0 2.05-.22l12.04-6.95-2.76-2.76-11.33 9.93z" fill="#EA4335"/>
          <path d="M21.6 10.27a1.94 1.94 0 0 0 0 3.46l.05.03-3.3-1.9.03-.03 3.22-1.56z" fill="#FBBC04"/>
          <path d="M3.18.24C2.5.6 2 1.34 2 2.27v19.46c0 .93.5 1.67 1.18 2.03l12.31-11.76L3.18.24z" fill="#4285F4"/>
          <path d="M17.27 7.59L5.23.64a2 2 0 0 0-2.05-.4L14.51 12l2.76-4.41z" fill="#34A853"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="white">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      )}
      <div>
        <p className="text-white/50 text-[10px] leading-none mb-0.5">
          {isAndroid ? "Get it on" : "Download on the"}
        </p>
        <p className="text-white font-semibold text-sm leading-none">
          {isAndroid ? "Google Play" : "App Store"}
        </p>
      </div>
    </motion.a>
  );
}

export default function AppDownloadSection() {
  return (
    <section className="relative bg-dark py-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-accent/6 rounded-full blur-[100px]" />
      </div>
      <div className="absolute inset-0 grid-texture opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: text content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">
                Mobile App
              </p>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white leading-tight">
                Your Wealth,{" "}
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
                  In Your Pocket
                </span>
              </h2>
            </motion.div>

            <motion.p
              className="text-white/55 text-base leading-relaxed max-w-md"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              Track your portfolio, run SIP calculations, review your financial plan,
              and connect with your advisor — all from one clean, secure app.
            </motion.p>

            {/* Feature pills */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18, duration: 0.38 }}
            >
              {[
                "Live Portfolio Tracking",
                "SIP Calculator",
                "Advisor Chat",
                "Goal Progress",
              ].map((f, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/8 border border-white/12 text-white/70"
                >
                  {f}
                </span>
              ))}
            </motion.div>

            {/* Store badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <StoreBadge store="android" initial={0.25} />
              <StoreBadge store="ios" initial={0.32} />
            </div>

            <motion.p
              className="text-white/25 text-xs"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              Available on Android & iOS · Free to download
            </motion.p>
          </div>

          {/* Right: phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}