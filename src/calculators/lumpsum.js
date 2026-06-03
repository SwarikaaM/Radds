/**
 * Lumpsum Investment Calculator
 * Formula: FV = PV × (1 + r)^n
 * where r = annual rate, n = years
 */
export function calcLumpsum(principal, annualRate, years) {
  const r = annualRate / 100;
  const total = principal * Math.pow(1 + r, years);
  return {
    invested: Math.round(principal),
    growth: Math.round(total - principal),
    total: Math.round(total),
    cagr: annualRate,
  };
}

export function buildLumpsumChartData(principal, annualRate, years) {
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

export const lumpsumConfig = {
  slug: "lumpsum",
  title: "Lumpsum Calculator",
  shortTitle: "Lumpsum",
  description:
    "Calculate the future value of a one-time lumpsum investment at different return rates and time horizons.",
  inputs: [
    {
      key: "principal",
      label: "Investment Amount",
      prefix: "₹",
      suffix: "",
      min: 10000,
      max: 50000000,
      step: 10000,
      default: 500000,
      helper: "One-time investment amount",
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
      helper: "CAGR expected from your investment",
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
      helper: "How long you stay invested",
    },
  ],
  summaryKeys: [
    { key: "invested", label: "Amount Invested", color: "primary" },
    { key: "growth", label: "Wealth Gained", color: "success" },
    { key: "total", label: "Total Value", color: "gradient" },
  ],
  chartSeries: [
    { key: "invested", name: "Invested", color: "#22568F" },
    { key: "total", name: "Total Value", color: "#39C3EF" },
  ],
  tableColumns: ["Year", "Initial Investment", "Growth", "Total Value"],
  tableRowKeys: ["year", "invested", "growth", "total"],
  faqs: [
    {
      question: "When is a lumpsum investment better than a SIP?",
      answer:
        "Lumpsum works best when you have a large amount available (bonus, inheritance, property sale) and market valuations are attractive. If markets are at a low or fair value, lumpsum investments tend to outperform SIPs due to immediate compounding. In uncertain or expensive markets, SIP is generally safer.",
    },
    {
      question: "What is CAGR and how do I estimate it?",
      answer:
        "CAGR (Compound Annual Growth Rate) is the rate at which an investment would have grown if it grew at a steady rate annually. For large-cap equity funds, historical CAGR is approximately 12–14% over 10+ years. Debt funds typically return 6–8%. Always use conservative estimates for planning.",
    },
    {
      question: "Is lumpsum investing risky?",
      answer:
        "It carries timing risk — if you invest at a market peak, you may face short-term losses. However, over a 10+ year horizon, this risk reduces significantly. For lower risk, consider a Systematic Transfer Plan (STP) where you park money in a liquid fund and transfer to equity funds in monthly tranches.",
    },
    {
      question: "Can I do a lumpsum in mutual funds directly?",
      answer:
        "Yes. Any mutual fund allows lumpsum investments above the minimum amount (usually ₹1,000–₹5,000 depending on the fund). You can invest directly via AMC websites, registrar platforms (CAMS, KFintech), or investment platforms. Always complete KYC before investing.",
    },
    {
      question: "How does inflation affect my lumpsum returns?",
      answer:
        "Inflation erodes purchasing power. If your investment returns 12% but inflation is 6%, your real return is approximately 6%. Our calculator shows nominal returns. For long-term planning, subtract expected inflation (typically 5–6% in India) from your expected return to get the real growth of your wealth.",
    },
  ],
};
