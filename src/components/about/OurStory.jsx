import ScrollReveal from "../ui/ScrollReveal";

export default function OurStory() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div>
              <p className="text-primary font-semibold uppercase tracking-wider mb-3">
                Our Story
              </p>

              <h2 className="font-playfair text-5xl font-bold mb-8 text-[#0D1B2E]">
                Helping Investors Build Wealth With Confidence
              </h2>

              <p className="text-[#6B7E99] mb-6 leading-relaxed">
                Radds Capital was founded with a simple belief:
                financial planning should be accessible,
                transparent, and centered around the client.
              </p>

              <p className="text-[#6B7E99] mb-8 leading-relaxed">
                We help individuals and families make
                smarter financial decisions through
                investments, insurance planning,
                retirement strategies, and ongoing
                advisory support.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xl mb-2">
                    Mission
                  </h3>
                  <p className="text-[#6B7E99]">
                    Empower clients with clear,
                    practical financial guidance.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-xl mb-2">
                    Vision
                  </h3>
                  <p className="text-[#6B7E99]">
                    Become the most trusted financial
                    advisory partner for Indian families.
                  </p>
                </div>
              </div>

              <blockquote className="border-l-4 border-primary pl-5 mt-10 italic text-xl text-[#0D1B2E]">
                “Financial advice should be transparent,
                personal, and built around the life you want.”
              </blockquote>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="h-[500px] rounded-2xl bg-[#F4F8FC] border border-[#E2EBF5] flex items-center justify-center">
              <span className="text-[#6B7E99]">
                Office / Team Image Placeholder
              </span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}