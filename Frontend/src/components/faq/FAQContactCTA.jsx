import { motion } from "framer-motion";
import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";

export default function FAQContactCTA() {
  return (
    <section className="py-20 bg-[#0D1B2E]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <ScrollReveal>
          <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold mb-4">
            Still have a question?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Our team is happy to help you understand your next step.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/contact">Contact Us</Button>
            <Button href="/contact#book" variant="outline">Book Consultation</Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}