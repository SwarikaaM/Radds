/**
 * SIP (Systematic Investment Plan) Calculator
 * Formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r)
 * where r = monthly rate, n = total months
 */
export function calcSIP(monthly, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  const total = r === 0
    ? monthly * n
    : monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  const invested = monthly * n;
  return {
    invested: Math.round(invested),
    returns: Math.round(total - invested),
    total: Math.round(total),
  };
}

export function buildSIPChartData(monthly, annualRate, years) {
  const r = annualRate / 12 / 100;
  return Array.from({ length: years }, (_, i) => {
    const n = (i + 1) * 12;
    const total = r === 0
      ? monthly * n
      : monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const invested = monthly * n;
    return {
      year: i + 1,
      invested: Math.round(invested),
      returns: Math.round(total - invested),
      total: Math.round(total),
    };
  });
}

export const sipConfig = {
  slug: "sip",
  title: "SIP Calculator",
  shortTitle: "SIP",
  description:
    "Find out how much your monthly SIP can grow into over time with the power of compounding.",
  inputs: [
    {
      key: "monthly",
      label: "Monthly Investment",
      prefix: "₹",
      suffix: "",
      min: 500,
      max: 200000,
      step: 500,
      default: 5000,
      helper: "Amount you invest every month",
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
      helper: "Historical average for equity mutual funds: 12–15%",
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
      helper: "Longer duration = more compounding benefit",
    },
  ],
  summaryKeys: [
    { key: "invested", label: "Invested Amount", color: "primary" },
    { key: "returns", label: "Estimated Returns", color: "success" },
    { key: "total", label: "Total Value", color: "gradient" },
  ],
  chartSeries: [
    { key: "invested", name: "Invested", color: "#22568F" },
    { key: "total", name: "Total Value", color: "#39C3EF" },
  ],
  tableColumns: ["Year", "Invested", "Returns", "Total Value"],
  tableRowKeys: ["year", "invested", "returns", "total"],
  faqs: [
    {
      question: "What is a SIP and how does it work?",
      answer:
        "A Systematic Investment Plan (SIP) lets you invest a fixed amount in a mutual fund at regular intervals — usually monthly. Each instalment buys units at the prevailing NAV. Over time, you accumulate units and benefit from rupee cost averaging, which smooths out market volatility.",
    },
    {
      question: "Is the 12% return assumption realistic?",
      answer:
        "The Indian equity market (Nifty 50) has delivered approximately 12–14% CAGR over long periods (10+ years). However, actual returns vary year to year and are not guaranteed. Debt funds typically return 6–8%, while small-cap funds may deliver higher but more volatile returns.",
    },
    {
      question: "What is rupee cost averaging?",
      answer:
        "When you invest a fixed amount monthly, you automatically buy more units when prices are low and fewer when prices are high. Over time, this averages out your purchase cost — protecting you from investing all your money at a market peak.",
    },
    {
      question: "Can I change my SIP amount later?",
      answer:
        "Yes. Most mutual fund platforms allow you to pause, increase, decrease, or stop your SIP at any time without penalty. Increasing your SIP annually (Step-up SIP) is a powerful strategy to accelerate wealth creation as your income grows.",
    },
    {
      question: "Are SIP returns taxed?",
      answer:
        "For equity mutual funds, gains on units held for more than 12 months are taxed at 10% (LTCG) above ₹1 lakh per year. Gains on units held less than 12 months are taxed at 15% (STCG). Each SIP instalment is treated as a separate investment for tax calculation purposes.",
    },
  ],
};
