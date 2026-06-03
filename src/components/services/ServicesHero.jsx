import { ArrowRight, Calculator } from "lucide-react";
import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";

export default function ServicesHero() {
  return (
    <section className="bg-[#0D1B2E] text-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="max-w-4xl">
            <p className="text-secondary font-semibold uppercase tracking-widest mb-4">
              Radds Capital Services
            </p>

            <h1 className="font-playfair text-5xl md:text-6xl font-bold leading-tight mb-6">
              Advice-Led Financial Services for Every Goal
            </h1>

            <p className="text-white/70 text-lg md:text-xl max-w-3xl mb-10">
              From your first SIP to retirement income planning, Radds Capital
              helps you make confident financial decisions.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="/contact#book" size="lg">
                Book Free Consultation
                <ArrowRight size={18} />
              </Button>

              <Button href="/calculators" variant="ghost" size="lg">
                <Calculator size={18} />
                Explore Calculators
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}