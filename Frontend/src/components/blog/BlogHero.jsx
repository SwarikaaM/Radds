import ScrollReveal from "../ui/ScrollReveal";

export default function BlogHero() {
  return (
    <section className="bg-dark text-white py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6">
            Insights to Keep You Ahead
          </h1>

          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Simple, practical writing on markets,
            mutual funds, insurance, tax, and
            financial planning.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}