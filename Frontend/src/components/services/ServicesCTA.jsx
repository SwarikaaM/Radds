import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";

export default function ServicesCTA() {
  return (
    <section className="py-24 bg-[#0D1B2E]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <ScrollReveal>
          <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold mb-5">
            Not sure which service fits your goal?
          </h2>

          <p className="text-white/70 text-lg mb-8">
            Talk to an advisor and get a clear next step.
          </p>

          <Button href="/contact#book" size="lg">
            Talk to an Expert
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}