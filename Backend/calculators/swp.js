// calculators/swp.js
function calculateSWP({ corpus, monthlyWithdrawal, annualReturn, years }) {
  const r = annualReturn / 100 / 12;
  const n = years * 12;
  let balance = corpus;
  const yearlyTable = [];

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + r) - monthlyWithdrawal;
      if (balance < 0) balance = 0;
    }
    yearlyTable.push({
      year: y,
      withdrawn: Math.round(monthlyWithdrawal * 12 * y),
      balance: Math.round(Math.max(balance, 0)),
    });
  }

  const totalWithdrawn = monthlyWithdrawal * n;
  return {
    summary: {
      initial_corpus: corpus,
      total_withdrawn: Math.round(totalWithdrawn),
      final_balance: Math.round(Math.max(balance, 0)),
    },
    yearly_table: yearlyTable,
    chart_data: yearlyTable.map(r => ({ year: r.year, balance: r.balance })),
  };
}
module.exports = { calculateSWP };