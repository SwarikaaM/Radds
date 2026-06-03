import Button from "../ui/Button";

export default function AboutCTA() {
  return (
    <section className="py-24 bg-[#0D1B2E]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-playfair text-5xl font-bold text-white mb-6">
          Meet the team behind your financial plan
        </h2>

        <p className="text-white/70 text-lg mb-8">
          Let’s discuss your goals and create a strategy
          tailored to your future.
        </p>

        <Button href="/contact#book">
          Book Consultation
        </Button>
      </div>
    </section>
  );
}