import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import { testimonials } from "../../data/testimonials";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rating ? "text-warning fill-warning" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    <motion.div
      className="relative bg-white rounded-card p-6 border border-[#E2EBF5] shadow-sm flex flex-col gap-4 w-[340px] flex-shrink-0 h-full"
      whileHover={{
        y: -3,
        borderColor: "rgba(34,86,143,0.22)",
        boxShadow: "0 12px 32px rgba(34,86,143,0.10)",
      }}
      transition={{ duration: 0.2 }}
    >
      <Quote size={20} className="text-primary/20 flex-shrink-0" />
      <p className="text-textmuted text-sm leading-relaxed flex-1 italic">"{t.quote}"</p>
      <div className="flex items-center justify-between pt-3 border-t border-[#F0F4F8]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{t.initials}</span>
          </div>
          <div>
            <p className="text-textprimary font-semibold text-sm leading-none">{t.name}</p>
            <p className="text-textmuted text-xs mt-0.5">{t.city}</p>
          </div>
        </div>
        <StarRating rating={t.rating} />
      </div>
    </motion.div>
  );
}

// Duplicate enough cards to fill infinite loop seamlessly
const track = [...testimonials, ...testimonials, ...testimonials];

export default function Testimonials() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="bg-lightbg py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <SectionHeader
          eyebrow="Client Stories"
          title="Trusted By Families Across India"
          subtitle="Real results from real people, across every stage of their financial journey."
        />
      </div>

      {/* Marquee track */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-lightbg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-lightbg to-transparent z-10 pointer-events-none" />

        <div
          className="flex gap-5 px-4"
          style={{
            animation: paused ? "none" : "testimonialScroll 40s linear infinite",
            width: "max-content",
          }}
        >
          {track.map((t, i) => (
            <TestimonialCard key={`${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}