import ScrollReveal from "../ui/ScrollReveal";

export default function LearningHero() {
  return (
    <section className="bg-dark text-white py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6">
            Learn Finance at Your Own Pace
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Free beginner-friendly lessons on investing,
            insurance, tax, and planning.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}