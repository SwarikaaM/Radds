import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, PhoneCall, ShieldCheck } from "lucide-react";
import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";

export default function FinalCTA() {
  return (
    <section className="relative bg-dark py-16 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-primary/12 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px]" />
      </div>

      {/* Grid texture overlay */}
      <div className="absolute inset-0 grid-texture opacity-40 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-4 py-2 mb-8">
            <ShieldCheck size={14} className="text-accent" />
            <span className="text-white/70 text-xs font-medium">SEBI Registered · Fee-Only Advisory · No Commissions</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-white leading-tight mb-5">
            Ready to Take Control of Your{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
              Financial Future?
            </span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-white/55 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Start with a conversation, leave with clarity. Our advisors are ready to build a plan around{" "}
            <span className="text-white/80">your</span> life, not a generic template.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button variant="accent" size="lg" className="min-w-[200px] justify-center">
                Start Your Journey
                <ArrowUpRight size={17} />
              </Button>
            </Link>
            <Link to="/contact#book">
              <Button variant="ghost" size="lg" className="min-w-[200px] justify-center">
                <PhoneCall size={16} />
                Talk to an Expert
              </Button>
            </Link>
          </div>
        </ScrollReveal>

        {/* Trust micro-badges */}
        <ScrollReveal delay={0.45}>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
            {[
              "Free First Consultation",
              "No Commitment Required",
              "10,000+ Families Trust Us",
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2 text-white/35 text-xs">
                <span className="w-1.5 h-1.5 bg-accent/60 rounded-full flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
