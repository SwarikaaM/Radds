import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";
import { testimonials } from "../../data/testimonials";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < rating ? "text-warning fill-warning" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t, active }) {
  return (
    <motion.div
      className={`relative bg-white rounded-card p-6 border shadow-sm flex flex-col gap-4 h-full transition-all duration-300 ${
        active ? "border-primary/25 shadow-lg shadow-primary/8" : "border-[#E2EBF5]"
      }`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Quote size={22} className="text-primary/20 flex-shrink-0" />
      <p className="text-textmuted text-sm leading-relaxed flex-1 italic">"{t.quote}"</p>
      <div className="flex items-center justify-between pt-2 border-t border-[#F0F4F8]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{t.initials}</span>
          </div>
          <div>
            <p className="text-textprimary font-semibold text-sm">{t.name}</p>
            <p className="text-textmuted text-xs">{t.city}</p>
          </div>
        </div>
        <StarRating rating={t.rating} />
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;
  const visibleCount = 3; // on desktop

  const scrollTo = (idx) => {
    setActiveIdx(idx);
    if (trackRef.current) {
      const card = trackRef.current.children[idx];
      if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  };

  const prev = () => scrollTo((activeIdx - 1 + total) % total);
  const next = () => scrollTo((activeIdx + 1) % total);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % total);
    }, 4000);
    return () => clearInterval(id);
  }, [paused, total]);

  return (
    <section className="bg-lightbg py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <SectionHeader
            eyebrow="Client Stories"
            title="Trusted By Families Across India"
            align="left"
            className="mb-0"
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-full border border-[#E2EBF5] bg-white hover:border-primary hover:text-primary text-textmuted transition-all flex items-center justify-center shadow-sm"
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="w-9 h-9 rounded-full border border-[#E2EBF5] bg-white hover:border-primary hover:text-primary text-textmuted transition-all flex items-center justify-center shadow-sm"
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Desktop grid */}
        <div
          className="hidden md:grid grid-cols-3 gap-5"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} t={t} active={i === activeIdx} />
          ))}
        </div>

        {/* Mobile scroll */}
        <div
          ref={trackRef}
          className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {testimonials.map((t, i) => (
            <div key={t.id} className="snap-center flex-shrink-0 w-[82vw]">
              <TestimonialCard t={t} active={i === activeIdx} />
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIdx
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-[#D1DDE8] hover:bg-primary/40"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
