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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <Badge icon={Calculator} variant="white">Free Planning Tool</Badge>
        </motion.div>

        <motion.h1
          className="font-playfair text-4xl md:text-5xl font-bold text-white leading-tight mb-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.6 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.5 }}
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5 }}
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
