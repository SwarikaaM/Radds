import { motion } from "framer-motion";
import Button from "../ui/Button";
import { ArrowRight } from "lucide-react";

export default function CareersHero() {
  const scrollToForm = () => {
    document.getElementById("career-form")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-[#0D1B2E] text-white">
      <div className="container mx-auto px-6 py-28 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-playfair text-5xl md:text-7xl font-bold mb-6"
        >
          Build the Future of Financial Advice
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto text-lg text-white/70 mb-10"
        >
          Join a team that believes financial clarity can change lives.
        </motion.p>

        <Button onClick={scrollToForm}>
          Apply Today
          <ArrowRight size={18} />
        </Button>
      </div>
    </section>
  );
}