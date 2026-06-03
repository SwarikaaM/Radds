/**
 * SWP (Systematic Withdrawal Plan) Calculator
 * Simulates monthly withdrawals from a corpus, growing at annual rate.
 */
export function calcSWP(corpus, monthly, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  let balance = corpus;
  const totalWithdrawn = monthly * n;

  for (let i = 0; i < n; i++) {
    balance = balance * (1 + r) - monthly;
    if (balance < 0) { balance = 0; break; }
  }

  return {
    initialCorpus: Math.round(corpus),
    totalWithdrawn: Math.round(totalWithdrawn),
    finalCorpus: Math.round(Math.max(balance, 0)),
    totalGrowth: Math.round(Math.max(balance, 0) + totalWithdrawn - corpus),
  };
}

export function buildSWPChartData(corpus, monthly, annualRate, years) {
  const r = annualRate / 12 / 100;
  let balance = corpus;
  const data = [];

  for (let y = 1; y <= years; y++) {
    const openingCorpus = balance;
    let growth = 0;
    for (let m = 0; m < 12; m++) {
      const monthGrowth = balance * r;
      growth += monthGrowth;
      balance = balance + monthGrowth - monthly;
      if (balance < 0) { balance = 0; }
    }
    const annualWithdrawal = monthly * 12;
    data.push({
      year: y,
      openingCorpus: Math.round(openingCorpus),
      withdrawal: Math.round(annualWithdrawal),
      growth: Math.round(growth),
      closingCorpus: Math.round(Math.max(balance, 0)),
    });
    if (balance <= 0) break;
  }
  return data;
}

export const swpConfig = {
  slug: "swp",
  title: "SWP Calculator",
  shortTitle: "SWP",
  description:
    "Plan your regular monthly withdrawals from a mutual fund corpus while letting the remaining balance keep growing.",
  inputs: [
    {
      key: "corpus",
      label: "Total Corpus",
      prefix: "₹",
      suffix: "",
      min: 100000,
      max: 50000000,
      step: 100000,
      default: 5000000,
      helper: "Your total invested / accumulated amount",
    },
    {
      key: "monthly",
      label: "Monthly Withdrawal",
      prefix: "₹",
      suffix: "",
      min: 1000,
      max: 500000,
      step: 1000,
      default: 25000,
      helper: "Amount you want to withdraw every month",
    },
    {
      key: "annualRate",
      label: "Expected Annual Return",
      prefix: "",
      suffix: "% p.a.",
      min: 1,
      max: 20,
      step: 0.5,
      default: 10,
      helper: "Expected return on remaining corpus",
      decimals: 1,
    },
    {
      key: "years",
      label: "Withdrawal Duration",
      prefix: "",
      suffix: " Yrs",
      min: 1,
      max: 40,
      step: 1,
      default: 15,
      helper: "How long you want the withdrawals to last",
    },
  ],
  summaryKeys: [
    { key: "initialCorpus", label: "Initial Corpus", color: "primary" },
    { key: "totalWithdrawn", label: "Total Withdrawn", color: "success" },
    { key: "finalCorpus", label: "Remaining Corpus", color: "gradient" },
  ],
  chartSeries: [
    { key: "closingCorpus", name: "Corpus Balance", color: "#22568F" },
    { key: "withdrawal", name: "Annual Withdrawal", color: "#39C3EF" },
  ],
  tableColumns: ["Year", "Opening Corpus", "Withdrawal", "Growth", "Closing Corpus"],
  tableRowKeys: ["year", "openingCorpus", "withdrawal", "growth", "closingCorpus"],
  faqs: [
    {
      question: "What is SWP and who should use it?",
      answer:
        "A Systematic Withdrawal Plan lets you withdraw a fixed amount every month from a mutual fund while the remaining balance continues to earn returns. It's ideal for retirees and those seeking regular income from their investments without selling the entire corpus at once.",
    },
    {
      question: "How is SWP different from a dividend plan?",
      answer:
        "Dividends are declared at the fund manager's discretion and are not guaranteed in amount or frequency. SWP gives you complete control — you choose the amount and date. Dividends also have tax implications at the fund level, while SWP withdrawals are treated as redemptions and taxed accordingly.",
    },
    {
      question: "Will my corpus run out with SWP?",
      answer:
        "It depends on the withdrawal amount vs. the growth rate. If the corpus grows faster than the withdrawal rate, it can sustain indefinitely. Our calculator shows the closing corpus each year — if it reaches zero, the fund is exhausted. Keeping withdrawal below 6–7% of the corpus annually is generally considered safe.",
    },
    {
      question: "Is SWP taxable?",
      answer:
        "Each SWP instalment is treated as a redemption. For equity funds, units redeemed after 12 months attract 10% LTCG tax on gains above ₹1L. Debt fund gains are taxed at your income slab rate. Since SWP redeems oldest units first (FIFO), many units in a long-running SWP will qualify for LTCG rates.",
    },
    {
      question: "Can I combine SIP and SWP?",
      answer:
        "Yes. A common strategy is to accumulate wealth via SIP during your earning years, then switch to SWP post-retirement. You can also run a SWP from one fund while simultaneously running a SIP in another, essentially generating income from past investments while still building future wealth.",
    },
  ],
};
