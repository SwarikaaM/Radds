import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp, Shield, BarChart2, CreditCard, Repeat,
  FileText, Landmark, Lock, Target, PieChart, ArrowUpRight,
} from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";
import { services } from "../../data/services";

const iconMap = {
  TrendingUp, Shield, BarChart2, CreditCard, Repeat,
  FileText, Landmark, Lock, Target, PieChart,
};

const colorPairs = [
  { bg: "bg-primary/8", text: "text-primary", border: "hover:border-primary/30 hover:shadow-primary/8" },
  { bg: "bg-secondary/8", text: "text-secondary", border: "hover:border-secondary/30 hover:shadow-secondary/8" },
  { bg: "bg-accent/8", text: "text-accent", border: "hover:border-accent/30 hover:shadow-accent/8" },
  { bg: "bg-success/8", text: "text-success", border: "hover:border-success/30 hover:shadow-success/8" },
  { bg: "bg-warning/8", text: "text-warning", border: "hover:border-warning/30 hover:shadow-warning/8" },
];

export default function ServicesPreview() {
  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our Services"
          title="Everything Financial, Under One Roof"
          subtitle="Explore advice-led solutions for every stage of your financial life."
          className="mb-10"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || TrendingUp;
            const colors = colorPairs[i % colorPairs.length];
            return (
              <ScrollReveal key={service.id} delay={i * 0.05}>
                <Link to={`/services/${service.slug}`}>
                  <motion.div
                    className={`relative bg-white rounded-card p-5 border border-[#E2EBF5] shadow-sm cursor-pointer h-full flex flex-col overflow-hidden`}
                    whileHover={{ y: -4, boxShadow: "0 12px 32px -8px rgba(34,86,143,0.12)", borderColor: "rgba(34,86,143,0.22)" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {/* Bottom accent line that slides in */}
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary`}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{ originX: 0 }}
                    />
                    <motion.div
                      className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Icon size={18} className={colors.text} />
                    </motion.div>
                    <h3 className="text-textprimary font-semibold text-sm mb-1.5 leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-textmuted text-xs leading-relaxed flex-1">
                      {service.description}
                    </p>
                    <motion.div
                      className={`flex items-center gap-1 mt-3 text-xs font-medium ${colors.text}`}
                      initial={{ opacity: 0, x: -4 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      Explore <ArrowUpRight size={12} />
                    </motion.div>
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
