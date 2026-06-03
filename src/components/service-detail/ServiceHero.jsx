import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";

export default function ServiceHero({ service }) {
  const Icon = service.icon;

  return (
    <section className="bg-[#0D1B2E] text-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="max-w-4xl">
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mb-6">
              <Icon size={32} />
            </div>

            <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-5">
              {service.name}
            </h1>

            <p className="text-xl text-white/70 mb-8">
              {service.tagline}
            </p>

            <Button href="/contact#book">
              Get Started
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}