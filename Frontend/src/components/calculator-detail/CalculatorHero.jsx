import { motion } from "framer-motion";
import { Calculator, ChevronDown } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function CalculatorHero({ title, description }) {
  const scrollToCalc = () => {
    document.getElementById("calculator-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative bg-dark grid-texture pt-24 pb-16 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4"
        >
          <Badge icon={Calculator} variant="white">Free Planning Tool</Badge>
        </motion.div>

        <motion.h1
          className="font-playfair text-4xl md:text-5xl font-bold text-white leading-tight mb-5"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Button variant="accent" size="lg" onClick={scrollToCalc}>
            Calculate Now
            <ChevronDown size={16} />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
