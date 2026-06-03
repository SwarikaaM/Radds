import ScrollReveal from "../ui/ScrollReveal";

export default function FAQHero() {
  return (
    <section className="bg-[#0D1B2E] text-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <ScrollReveal>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6">
            Frequently Asked Questions
          </h1>

          <p className="text-white/70 text-lg">
            Clear answers about advisory, investments, insurance,
            calculators, and consultations.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}