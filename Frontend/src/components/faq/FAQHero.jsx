import { motion } from "framer-motion";

export default function FAQHero() {
  return (
    <section className="bg-[#0D1B2E] text-white pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.h1
          className="font-playfair text-5xl md:text-6xl font-bold mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          Frequently Asked Questions
        </motion.h1>
        <motion.p
          className="text-white/60 text-lg"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        >
          Clear answers about advisory, investments, insurance,
          calculators, and consultations.
        </motion.p>
      </div>
    </section>
  );
}