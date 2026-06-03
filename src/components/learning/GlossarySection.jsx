import { useMemo, useState } from "react";

import FAQAccordion from "../ui/FAQAccordion";
import SectionHeader from "../ui/SectionHeader";

const glossaryTerms = [
  {
    term: "Asset Allocation",
    definition:
      "The process of dividing investments across asset classes such as equity, debt, and cash.",
  },

  {
    term: "CAGR",
    definition:
      "Compound Annual Growth Rate. The average annual growth rate of an investment over a specified period.",
  },

  {
    term: "ELSS",
    definition:
      "Equity Linked Savings Scheme. A tax-saving mutual fund eligible under Section 80C.",
  },

  {
    term: "Expense Ratio",
    definition:
      "The annual fee charged by a mutual fund to manage investments.",
  },

  {
    term: "NAV",
    definition:
      "Net Asset Value. The per-unit value of a mutual fund.",
  },

  {
    term: "NPS",
    definition:
      "National Pension System. A government-backed retirement savings scheme.",
  },

  {
    term: "SIP",
    definition:
      "Systematic Investment Plan. A method of investing fixed amounts regularly into mutual funds.",
  },

  {
    term: "SWP",
    definition:
      "Systematic Withdrawal Plan. Allows periodic withdrawals from mutual fund investments.",
  },

  {
    term: "Term Insurance",
    definition:
      "A pure life insurance product that provides financial protection for a specified period.",
  },
];

export default function GlossarySection() {
  const [activeLetter, setActiveLetter] =
    useState("A");

  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const groupedTerms = useMemo(() => {
    return glossaryTerms.filter(
      (item) =>
        item.term.charAt(0).toUpperCase() ===
        activeLetter
    );
  }, [activeLetter]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Finance Glossary"
          subtitle="Understand common financial terms and concepts."
        />

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() =>
                setActiveLetter(letter)
              }
              className={`
                min-w-[40px]
                h-10
                rounded-lg
                text-sm
                font-medium
                transition-all
                ${
                  activeLetter === letter
                    ? "bg-primary text-white"
                    : "bg-lightbg text-textmuted hover:bg-primary/10 hover:text-primary"
                }
              `}
            >
              {letter}
            </button>
          ))}
        </div>

        {groupedTerms.length ? (
          <FAQAccordion
            items={groupedTerms.map(
              (item) => ({
                question: item.term,
                answer: item.definition,
              })
            )}
          />
        ) : (
          <div className="text-center py-10">
            <p className="text-textmuted">
              No terms available for "{activeLetter}".
            </p>
          </div>
        )}
      </div>
    </section>
  );
}