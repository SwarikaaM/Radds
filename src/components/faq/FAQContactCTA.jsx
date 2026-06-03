import Button from "../ui/Button";

export default function FAQContactCTA() {
  return (
    <section className="py-24 bg-[#0D1B2E]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-playfair text-5xl text-white font-bold mb-6">
          Still have a question?
        </h2>

        <p className="text-white/70 text-lg mb-8">
          Our team is happy to help you understand your next step.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/contact">
            Contact Us
          </Button>

          <Button href="/contact#book" variant="outline">
            Book Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}