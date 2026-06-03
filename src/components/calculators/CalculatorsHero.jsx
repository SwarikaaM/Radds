import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BarChart2, ChevronRight, Table2, LineChart } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const stats = [
  { icon: BarChart2, label: "Planning Tools", value: "6" },
  { icon: LineChart, label: "Real-time Graphs", value: "Live" },
  { icon: Table2, label: "Year-wise Tables", value: "Built-in" },
];

export default function CalculatorsHero() {
  return (
    <section className="relative bg-dark grid-texture pt-24 pb-20 overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[110px]" />
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-secondary/8 rounded-full blur-[90px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5"
        >
          <Badge icon={BarChart2} variant="white">Free Planning Tools</Badge>
        </motion.div>

        {/* H1 */}
        <motion.h1
          className="font-playfair text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-white leading-tight mb-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.65 }}
        >
          Financial Calculators,{" "}
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
            Built for Clear Decisions
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto mb-9"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55 }}
        >
          Estimate your investments, withdrawals, and long-term wealth outcomes with simple,
          transparent tools — no sign-up required.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link to="/calculators/sip">
            <Button variant="accent" size="lg">
              Start with SIP Calculator
              <ChevronRight size={16} />
            </Button>
          </Link>
          <Link to="/contact#book">
            <Button variant="ghost" size="lg">
              Book Consultation
            </Button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          {stats.map(({ icon: Icon, label, value }, i) => (
            <div key={i} className="flex items-center gap-2.5">
              {i > 0 && (
                <span className="hidden sm:block w-px h-6 bg-white/10" />
              )}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/8 border border-white/12 flex items-center justify-center flex-shrink-0">
                  <Icon size={13} className="text-accent" />
                </div>
                <div className="text-left">
                  <p className="text-white font-mono-num font-semibold text-sm leading-none">{value}</p>
                  <p className="text-white/40 text-[11px] mt-0.5">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}