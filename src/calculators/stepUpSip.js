/**
 * Step-up SIP Calculator
 * Monthly SIP increases by a fixed % every year.
 * Computes year-by-year accumulation.
 */
export function calcStepUpSIP(initialMonthly, annualRate, years, annualStepUp) {
  const r = annualRate / 12 / 100;
  let balance = 0;
  let totalInvested = 0;
  let monthly = initialMonthly;

  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + r) + monthly;
      totalInvested += monthly;
    }
    // Increase SIP at the end of each year
    monthly = monthly * (1 + annualStepUp / 100);
  }

  return {
    invested: Math.round(totalInvested),
    returns: Math.round(balance - totalInvested),
    total: Math.round(balance),
    finalMonthly: Math.round(monthly),
  };
}

export function buildStepUpSIPChartData(initialMonthly, annualRate, years, annualStepUp) {
  const r = annualRate / 12 / 100;
  let balance = 0;
  let totalInvested = 0;
  let monthly = initialMonthly;
  const data = [];

  for (let y = 0; y < years; y++) {
    const yearMonthly = monthly;
    let annualInvested = 0;
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + r) + monthly;
      totalInvested += monthly;
      annualInvested += monthly;
    }
    data.push({
      year: y + 1,
      monthlyThisYear: Math.round(yearMonthly),
      annualInvestment: Math.round(annualInvested),
      invested: Math.round(totalInvested),
      returns: Math.round(balance - totalInvested),
      total: Math.round(balance),
    });
    monthly = monthly * (1 + annualStepUp / 100);
  }
  return data;
}

export const stepUpSIPConfig = {
  slug: "step-up-sip",
  title: "Step-up SIP Calculator",
  shortTitle: "Step-up SIP",
  description:
    "Model wealth growth when you increase your SIP amount annually — typically matching your salary increments.",
  inputs: [
    {
      key: "initialMonthly",
      label: "Starting Monthly SIP",
      prefix: "₹",
      suffix: "",
      min: 500,
      max: 200000,
      step: 500,
      default: 5000,
      helper: "SIP amount in the first year",
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
      helper: "Expected CAGR from your mutual fund",
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
      default: 15,
      helper: "Total years of investment",
    },
    {
      key: "annualStepUp",
      label: "Annual Step-up Rate",
      prefix: "",
      suffix: "% p.a.",
      min: 1,
      max: 50,
      step: 1,
      default: 10,
      helper: "% by which you increase your SIP each year (10% is common)",
    },
  ],
  summaryKeys: [
    { key: "invested", label: "Total Invested", color: "primary" },
    { key: "returns", label: "Estimated Returns", color: "success" },
    { key: "total", label: "Final Corpus", color: "gradient" },
  ],
  chartSeries: [
    { key: "invested", name: "Invested", color: "#22568F" },
    { key: "total", name: "Total Value", color: "#39C3EF" },
  ],
  tableColumns: ["Year", "Monthly SIP", "Annual Investment", "Returns", "Total Value"],
  tableRowKeys: ["year", "monthlyThisYear", "annualInvestment", "returns", "total"],
  faqs: [
    {
      question: "What is a Step-up SIP?",
      answer:
        "A Step-up (or Top-up) SIP automatically increases your monthly investment by a fixed percentage every year. This is designed to keep pace with your growing income — as your salary increases, so does your SIP, ensuring your savings rate doesn't erode over time.",
    },
    {
      question: "How much step-up rate should I choose?",
      answer:
        "A common rule of thumb is to step up your SIP by the same percentage as your annual salary increment — typically 8–15% for salaried professionals. Even a 10% annual step-up on a ₹5,000 SIP can double your final corpus compared to a flat SIP over 15 years.",
    },
    {
      question: "Is the step-up automatic in mutual funds?",
      answer:
        "Most major mutual fund platforms and AMCs support automatic step-up SIPs. You can set the percentage and frequency (usually annual) at the time of SIP registration. CAMS and KFintech registrars also support it. Check with your fund platform for the exact process.",
    },
    {
      question: "What if my income doesn't grow some years?",
      answer:
        "You can always pause or modify your step-up. Most platforms let you change your SIP amount any time. If you can't step up in a particular year, keeping the SIP flat is still far better than stopping it. Consistency matters more than perfect step-ups.",
    },
    {
      question: "How does step-up SIP compare to a regular flat SIP?",
      answer:
        "The difference is dramatic over long periods. For a ₹5,000 SIP at 12% for 20 years, the flat SIP grows to approximately ₹49.9 lakh. With a 10% annual step-up, the same starting SIP can grow to over ₹1.5 crore — roughly 3x more — with the added investment being manageable each year.",
    },
  ],
};
