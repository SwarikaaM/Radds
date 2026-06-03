import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, ArrowDownCircle, Clock, DollarSign, ArrowUpRight, Zap } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import { calculatorRegistry } from "../../data/calculatorRegistry";

const iconMap = {
  sip: TrendingUp,
  swp: ArrowDownCircle,
  "cost-of-delay-sip": Clock,
  lumpsum: DollarSign,
  "step-up-sip": ArrowUpRight,
  "one-time-investment": Zap,
};

const palette = [
  { bg: "bg-primary/8", text: "text-primary", border: "hover:border-primary/30 hover:shadow-primary/8" },
  { bg: "bg-secondary/8", text: "text-secondary", border: "hover:border-secondary/30 hover:shadow-secondary/8" },
  { bg: "bg-accent/8", text: "text-accent", border: "hover:border-accent/30 hover:shadow-accent/8" },
];

export default function RelatedCalculators({ currentSlug }) {
  const all = Object.values(calculatorRegistry);
  const related = all.filter((c) => c.slug !== currentSlug).slice(0, 3);

  return (
    <section className="bg-lightbg py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="font-playfair text-2xl font-bold text-textprimary mb-8">
            More Planning Tools
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {related.map((calc, i) => {
            const Icon = iconMap[calc.slug] || TrendingUp;
            const c = palette[i % palette.length];
            return (
              <ScrollReveal key={calc.slug} delay={i * 0.08}>
                <Link to={`/calculators/${calc.slug}`}>
                  <motion.div
                    className={`group bg-white rounded-card p-5 border border-[#E2EBF5] shadow-sm hover:shadow-lg transition-all duration-300 ${c.border}`}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon size={18} className={c.text} />
                    </div>
                    <h3 className="text-textprimary font-semibold text-sm mb-1.5 leading-snug">
                      {calc.title}
                    </h3>
                    <p className="text-textmuted text-xs leading-relaxed mb-4 line-clamp-2">
                      {calc.description}
                    </p>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${c.text} group-hover:gap-2 transition-all`}>
                      Calculate <ArrowUpRight size={12} />
                    </span>
                  </motion.div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
