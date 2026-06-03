import ScrollReveal from "../ui/ScrollReveal";

export default function ContactHero() {
  return (
    <section className="bg-[#0D1B2E] text-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <ScrollReveal>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6">
            Let's Talk About Your Financial Goals
          </h1>

          <p className="text-lg text-white/70">
            Reach out for investment planning, insurance guidance,
            portfolio review, or general enquiries.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}