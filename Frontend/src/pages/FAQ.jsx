import { useState } from "react";

import FAQHero from "../components/faq/FAQHero";
import FAQCategoryTabs from "../components/faq/FAQCategoryTabs";
import FAQList from "../components/faq/FAQList";
import FAQContactCTA from "../components/faq/FAQContactCTA";

export default function FAQ() {
  const [activeCategory, setActiveCategory] =
    useState("All");

  return (
    <>
      <main>
        <FAQHero />

        <section className="py-20 bg-[#F4F8FC]">
          <div className="max-w-7xl mx-auto px-6">
            <FAQCategoryTabs
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />

            <div className="mt-12">
              <FAQList
                activeCategory={activeCategory}
              />
            </div>
          </div>
        </section>

        <FAQContactCTA />
      </main>
    </>
  );
}