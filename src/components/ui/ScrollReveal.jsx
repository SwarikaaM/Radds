import { motion } from "framer-motion";

export default function ScrollReveal({ children, delay = 0, direction = "up", className = "" }) {
  const variants = {
    up: { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 32 }, visible: { opacity: 1, x: 0 } },
    fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={variants[direction] || variants.up}
    >
      {children}
    </motion.div>
  );
}
