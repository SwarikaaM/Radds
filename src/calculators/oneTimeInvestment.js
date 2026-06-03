/**
 * One-Time Investment Calculator
 * Same as lumpsum but with explicit tax/inflation adjusted view options.
 * Core formula: FV = PV × (1 + r)^n
 */
export function calcOneTime(principal, annualRate, years) {
  const r = annualRate / 100;
  const total = principal * Math.pow(1 + r, years);
  const growth = total - principal;
  return {
    invested: Math.round(principal),
    growth: Math.round(growth),
    total: Math.round(total),
    absoluteReturn: Math.round((growth / principal) * 100),
    cagr: annualRate,
  };
}

export function buildOneTimeChartData(principal, annualRate, years) {
  const r = annualRate / 100;
  return Array.from({ length: years }, (_, i) => {
    const y = i + 1;
    const total = principal * Math.pow(1 + r, y);
    return {
      year: y,
      invested: Math.round(principal),
      growth: Math.round(total - principal),
      total: Math.round(total),
    };
  });
}

export const oneTimeConfig = {
  slug: "one-time-investment",
  title: "One Time Investment Calculator",
  shortTitle: "One-Time",
  description:
    "Estimate the future value of a single large investment — ideal for planning bonuses, inheritance, or windfalls.",
  inputs: [
    {
      key: "principal",
      label: "Investment Amount",
      prefix: "₹",
      suffix: "",
      min: 10000,
      max: 50000000,
      step: 10000,
      default: 1000000,
      helper: "Total amount you invest today",
    },
    {
      key: "annualRate",
      label: "Expected Annual Return",
      prefix: "",
      suffix: "% p.a.",
      min: 1,
      max: 30,
      step: 0.5,
      default: 12,
      helper: "Expected CAGR over the investment period",
      decimals: 1,
    },
    {
      key: "years",
      label: "Investment Duration",
      prefix: "",
      suffix: " Yrs",
      min: 1,
      max: 40,
      step: 1,
      default: 10,
      helper: "Number of years you stay invested",
    },
  ],
  summaryKeys: [
    { key: "invested", label: "Amount Invested", color: "primary" },
    { key: "growth", label: "Wealth Gained", color: "success" },
    { key: "total", label: "Final Value", color: "gradient" },
  ],
  chartSeries: [
    { key: "invested", name: "Invested", color: "#22568F" },
    { key: "total", name: "Total Value", color: "#39C3EF" },
  ],
  tableColumns: ["Year", "Invested", "Growth", "Total Value"],
  tableRowKeys: ["year", "invested", "growth", "total"],
  faqs: [
    {
      question: "How is One-Time Investment different from Lumpsum?",
      answer:
        "They are essentially the same — a single large investment made at one point in time. The key distinction in planning is context: a lumpsum is typically money you already have, while a one-time investment might be a planned future event (bonus, maturity proceeds). Both use the same compound growth formula.",
    },
    {
      question: "What is the best instrument for a one-time investment?",
      answer:
        "For long horizons (7+ years), equity mutual funds (index funds or flexi-cap funds) typically give the best returns. For medium horizons (3–7 years), hybrid or balanced advantage funds work well. For short horizons (under 3 years), debt funds, FDs, or liquid funds are more appropriate.",
    },
    {
      question: "Should I invest the entire amount at once or spread it out?",
      answer:
        "Research shows that lumpsum investing outperforms phased investing in rising markets approximately 66% of the time. However, if you're concerned about timing risk, consider a Systematic Transfer Plan (STP) — invest in a liquid fund and systematically move to equity over 6–12 months.",
    },
    {
      question: "How do I account for inflation in my projections?",
      answer:
        "To find the real value of your corpus, use the formula: Real Value = Nominal Value ÷ (1 + inflation rate)^years. If your ₹10L investment grows to ₹31L in 10 years at 12%, but inflation is 6%, the real value is approximately ₹17.3L in today's money — still a significant gain.",
    },
    {
      question: "What taxes apply on one-time equity investments?",
      answer:
        "For equity mutual funds: gains on investments held over 12 months are taxed at 10% (LTCG) on gains above ₹1 lakh per year. Short-term gains (under 12 months) are taxed at 15% (STCG). For debt funds, gains are now taxed at your income slab rate regardless of holding period (post April 2023).",
    },
  ],
};
