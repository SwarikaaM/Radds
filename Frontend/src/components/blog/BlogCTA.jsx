import Button from "../ui/Button";

export default function BlogCTA() {
  return (
    <section className="pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark rounded-card p-12 text-center text-white">
          <h2 className="font-playfair text-4xl font-bold mb-4">
            Want advice specific to your situation?
          </h2>

          <p className="text-white/70 mb-8">
            Speak with a Radds Capital advisor and
            receive guidance tailored to your goals.
          </p>

          <Button
            href="/contact#book"
            variant="accent"
          >
            Book Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}