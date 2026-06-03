import { useMemo, useState } from "react";

import CalculatorsHero from "../components/calculators/CalculatorsHero";
import CalculatorCategoryTabs from "../components/calculators/CalculatorCategoryTabs";
import CalculatorGrid from "../components/calculators/CalculatorGrid";
import CalculatorFAQ from "../components/calculators/CalculatorFAQ";

import SectionHeader from "../components/ui/SectionHeader";
import ScrollReveal from "../components/ui/ScrollReveal";

import { calculators } from "../data/calculators";

export default function Calculators() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCalculators = useMemo(() => {
    if (activeCategory === "All") {
      return calculators;
    }

    return calculators.filter(
      (calculator) => calculator.category === activeCategory
    );
  }, [activeCategory]);

  return (
    <>
      <main>
        <CalculatorsHero />

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal>
              <SectionHeader
                eyebrow="Tools"
                title="Explore Financial Calculators"
                subtitle="Choose a calculator based on your planning objective."
              />

              <div className="mt-10 mb-12 flex justify-center">
                <CalculatorCategoryTabs
                  active={activeCategory}
                  onChange={setActiveCategory}
                />
              </div>

              <CalculatorGrid calculators={filteredCalculators} />
            </ScrollReveal>
          </div>
        </section>

        <CalculatorFAQ />
      </main>
    </>
  );
}