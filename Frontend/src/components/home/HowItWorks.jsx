import { motion } from "framer-motion";
import { CalendarDays, Target, FileBarChart, TrendingUp } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";

const steps = [
  {
    number: "01",
    icon: CalendarDays,
    title: "Book Free Consultation",
    description: "Schedule a no-obligation call with our AMFI-registered distributors. No sales pitch — just an honest conversation about your finances.",
  },
  {
    number: "02",
    icon: Target,
    title: "Share Your Goals",
    description: "Tell us where you want to be in 5, 10, or 20 years. We factor in your income, risk appetite, and life milestones.",
  },
  {
    number: "03",
    icon: FileBarChart,
    title: "Get Custom Plan",
    description: "Receive a curated set of mutual fund scheme recommendations matched to your risk profile, investment horizon, and goals — with full transparency on applicable commissions.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Grow With Us",
    description: "We review your mutual fund investments periodically and suggest adjustments based on market conditions and scheme performance. You stay informed; your investments stay on track.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-dark py-14 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader
          eyebrow="How It Works"
          title="Your Path to Financial Clarity"
          subtitle="Four simple steps to a wealth plan that actually works for you."
          dark
          className="mb-12"
        />

        {/* Desktop: horizontal with connecting line */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <motion.div
              className="absolute top-10 left-[12.5%] h-px bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              whileInView={{ width: "75%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
            />

            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <ScrollReveal key={i} delay={i * 0.15}>
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-6">
                        <motion.div
                          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/25 flex items-center justify-center relative z-10"
                          whileHover={{ scale: 1.06, borderColor: "rgba(34,86,143,0.6)" }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon size={28} className="text-accent" />
                        </motion.div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center z-20">
                          <span className="text-white text-[10px] font-mono-num font-bold">{i + 1}</span>
                        </div>
                      </div>
                      <h3 className="text-white font-semibold text-[15px] mb-2 leading-snug">{step.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="lg:hidden relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent opacity-30" />
          <div className="space-y-10 pl-16">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <ScrollReveal key={i} delay={i * 0.1} direction="left">
                  <div className="relative">
                    <div className="absolute -left-[52px] w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/15 border border-primary/30 flex items-center justify-center">
                      <Icon size={18} className="text-accent" />
                    </div>
                    <div className="absolute -left-[64px] -top-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-dark">
                      <span className="text-white text-[9px] font-mono-num font-bold">{i + 1}</span>
                    </div>
                    <h3 className="text-white font-semibold text-[15px] mb-1.5">{step.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
