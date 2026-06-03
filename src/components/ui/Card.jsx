import { motion } from "framer-motion";

export default function Card({ children, className = "", hover = false, glow = false, dark = false }) {
  const base = `rounded-card p-6 transition-all duration-300 ${
    dark
      ? "bg-white/5 border border-white/10 text-white"
      : "bg-white border border-[#E2EBF5] shadow-sm"
  } ${hover ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer" : ""} ${
    glow ? "hover:border-secondary/50 hover:shadow-secondary/10" : ""
  } ${className}`;

  if (hover) {
    return (
      <motion.div
        className={base}
        whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(34,86,143,0.12)" }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={base}>{children}</div>;
}
