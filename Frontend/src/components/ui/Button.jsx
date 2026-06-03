import { motion } from "framer-motion";

const variants = {
  primary: "bg-primary hover:bg-[#1a4470] text-white shadow-lg shadow-primary/25 hover:shadow-primary/40",
  secondary: "bg-secondary hover:bg-[#1a6f8f] text-white shadow-lg shadow-secondary/20",
  outline: "border border-primary/40 text-primary hover:bg-primary hover:text-white hover:border-primary",
  ghost: "border border-white/20 text-white hover:bg-white/10 hover:border-white/40",
  accent: "bg-accent hover:bg-[#22a8d4] text-dark font-semibold shadow-lg shadow-accent/25",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({ children, variant = "primary", size = "md", className = "", onClick, href, ...props }) {
  const base = `inline-flex items-center gap-2 font-medium rounded-btn transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        className={base}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={base}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
