import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, ArrowDownCircle, Clock, DollarSign, ArrowUpRight, Zap } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";
import { calculators } from "../../data/calculators";

const iconMap = { TrendingUp, ArrowDownCircle, Clock, DollarSign, ArrowUpRight, Zap };

const palette = [
  { bg: "bg-primary/8", text: "text-primary", glow: "hover:shadow-primary/10 hover:border-primary/25" },
  { bg: "bg-secondary/8", text: "text-secondary", glow: "hover:shadow-secondary/10 hover:border-secondary/25" },
  { bg: "bg-accent/8", text: "text-accent", glow: "hover:shadow-accent/10 hover:border-accent/25" },
  { bg: "bg-success/8", text: "text-success", glow: "hover:shadow-success/10 hover:border-success/25" },
  { bg: "bg-warning/8", text: "text-warning", glow: "hover:shadow-warning/10 hover:border-warning/25" },
  { bg: "bg-primary/8", text: "text-primary", glow: "hover:shadow-primary/10 hover:border-primary/25" },
];

export default function CalculatorCardsPreview() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Financial Tools"
          title="More Tools to Plan Your Future"
          subtitle="Free, instant calculators designed to help you make smarter financial decisions."
          className="mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {calculators.map((calc, i) => {
            const Icon = iconMap[calc.icon] || TrendingUp;
            const c = palette[i % palette.length];
            return (
              <ScrollReveal key={calc.id} delay={i * 0.07}>
                <Link to={`/calculators/${calc.slug}`}>
                  <motion.div
                    className={`group bg-white rounded-card p-6 border border-[#E2EBF5] shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${c.glow}`}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon size={20} className={c.text} />
                    </div>
                    <h3 className="text-textprimary font-semibold text-[15px] mb-1.5">{calc.title}</h3>
                    <p className="text-textmuted text-sm leading-relaxed mb-4">{calc.description}</p>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${c.text} group-hover:gap-2.5 transition-all`}>
                      Calculate <ArrowUpRight size={13} />
                    </span>
                  </motion.div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-10 text-center">
            <Link
              to="/calculators"
              className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors"
            >
              View All Calculators <ArrowUpRight size={15} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
