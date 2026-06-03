export default function Badge({ children, icon: Icon, variant = "default", className = "" }) {
  const variants = {
    default: "bg-primary/10 text-primary border border-primary/20",
    success: "bg-success/10 text-success border border-success/20",
    accent: "bg-accent/10 text-accent border border-accent/20",
    white: "bg-white/10 text-white border border-white/20",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase ${variants[variant]} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
