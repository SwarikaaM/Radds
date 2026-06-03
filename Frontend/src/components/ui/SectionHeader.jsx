import { motion } from "framer-motion";

export default function SectionHeader({ eyebrow, title, subtitle, align = "center", dark = false, className = "" }) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const textColor = dark ? "text-white" : "text-textprimary";
  const mutedColor = dark ? "text-white/60" : "text-textmuted";

  return (
    <motion.div
      className={`max-w-2xl ${alignClass} ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
    >
      {eyebrow && (
        <p className={`text-secondary font-semibold text-sm uppercase tracking-widest mb-3 font-dm`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-playfair text-3xl md:text-4xl font-bold leading-tight mb-4 ${textColor}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base md:text-lg leading-relaxed ${mutedColor}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
