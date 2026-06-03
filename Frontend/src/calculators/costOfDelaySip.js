/**
 * Cost of Delay SIP Calculator
 * Compares: starting NOW vs starting DELAYED by N years.
 * Same monthly SIP, same total investment period assumed for "on-time".
 */
export function calcCostOfDelay(monthly, annualRate, years, delayYears) {
  const r = annualRate / 12 / 100;

  const calcFV = (months) => {
    if (r === 0) return monthly * months;
    return monthly * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
  };

  // Start now: invest for 'years' years
  const nowMonths = years * 12;
  const nowTotal = calcFV(nowMonths);
  const nowInvested = monthly * nowMonths;

  // Start delayed: invest for (years - delayYears) years to reach same horizon
  const delayedMonths = Math.max((years - delayYears) * 12, 0);
  const delayedTotal = calcFV(delayedMonths);
  const delayedInvested = monthly * delayedMonths;

  const missedGrowth = nowTotal - delayedTotal;
  const missedInvestment = nowInvested - delayedInvested;

  return {
    nowInvested: Math.round(nowInvested),
    nowTotal: Math.round(nowTotal),
    delayedInvested: Math.round(delayedInvested),
    delayedTotal: Math.round(delayedTotal),
    missedGrowth: Math.round(missedGrowth),
    missedInvestment: Math.round(missedInvestment),
    corpusDifference: Math.round(missedGrowth),
  };
}

export function buildCostOfDelayChartData(monthly, annualRate, years, delayYears) {
  const r = annualRate / 12 / 100;
  const data = [];

  for (let y = 1; y <= years; y++) {
    const nowN = y * 12;
    const nowFV = r === 0 ? monthly * nowN : monthly * (((Math.pow(1 + r, nowN) - 1) / r) * (1 + r));

    const delayedN = Math.max((y - delayYears) * 12, 0);
    const delayedFV = delayedN === 0 ? 0 : r === 0 ? monthly * delayedN : monthly * (((Math.pow(1 + r, delayedN) - 1) / r) * (1 + r));

    data.push({
      year: y,
      startNow: Math.round(nowFV),
      startDelayed: Math.round(delayedFV),
      difference: Math.round(nowFV - delayedFV),
    });
  }
  return data;
}

export const costOfDelayConfig = {
  slug: "cost-of-delay-sip",
  title: "Cost of Delay SIP Calculator",
  shortTitle: "Cost of Delay",
  description:
    "See exactly how much wealth you lose by delaying your SIP by even a few years — the numbers are eye-opening.",
  inputs: [
    {
      key: "monthly",
      label: "Monthly SIP Amount",
      prefix: "₹",
      suffix: "",
      min: 500,
      max: 200000,
      step: 500,
      default: 5000,
      helper: "Same SIP amount used in both scenarios",
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
      label: "Investment Horizon",
      prefix: "",
      suffix: " Yrs",
      min: 5,
      max: 40,
      step: 1,
      default: 20,
      helper: "Total years from today to your goal",
    },
    {
      key: "delayYears",
      label: "Delay By",
      prefix: "",
      suffix: " Yrs",
      min: 1,
      max: 10,
      step: 1,
      default: 5,
      helper: "How many years you're thinking of waiting before starting",
    },
  ],
  summaryKeys: [
    { key: "nowTotal", label: "Start Now — Final Corpus", color: "success" },
    { key: "delayedTotal", label: "Start Delayed — Final Corpus", color: "primary" },
    { key: "corpusDifference", label: "Corpus Lost to Delay", color: "gradient" },
  ],
  chartSeries: [
    { key: "startNow", name: "Start Now", color: "#1DB954" },
    { key: "startDelayed", name: "Start Delayed", color: "#22568F" },
  ],
  tableColumns: ["Year", "Start Now Corpus", "Delayed Corpus", "Difference"],
  tableRowKeys: ["year", "startNow", "startDelayed", "difference"],
  faqs: [
    {
      question: "Why does delaying a SIP hurt so much?",
      answer:
        "Compounding is exponential — the bulk of the gains happen in the later years. When you delay, you don't just lose the early investments; you lose all the compounding those investments would have generated. A 5-year delay on a ₹5,000 SIP at 12% over 20 years can cost over ₹20 lakh in final corpus.",
    },
    {
      question: "What if I increase my SIP later to compensate for the delay?",
      answer:
        "You would need to invest significantly more every month to catch up. For example, starting 5 years late at 12% return typically requires roughly 1.8–2x the monthly SIP to reach the same final corpus. It's almost always better to start small now than large later.",
    },
    {
      question: "Is this calculator useful for retirement planning?",
      answer:
        "Absolutely. It's one of the most powerful tools for retirement planning. Seeing the concrete rupee cost of waiting even 2–3 years is often what motivates people to start immediately rather than waiting for the 'right time'.",
    },
    {
      question: "What does 'same horizon' mean in this calculator?",
      answer:
        "Both scenarios are measured to the same end date — your goal date. So if your goal is 20 years away, the 'start now' scenario runs for 20 years and the 'delay by 5 years' scenario runs for only 15 years. The difference shows the real cost of that delay.",
    },
    {
      question: "Are there any situations where delaying is acceptable?",
      answer:
        "If you have high-interest debt (credit cards, personal loans above 15%), paying that off first may be more financially efficient. However, for most people, a small SIP started immediately — even ₹500/month — beats waiting until you can invest more comfortably.",
    },
  ],
};
