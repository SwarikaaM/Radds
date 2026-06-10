// SIP Calculator — server-side recalculation
// Inputs: monthlyAmount, annualReturn, years
function calculateSIP({ monthlyAmount, annualReturn, years }) {
  const r = annualReturn / 100 / 12;
  const n = years * 12;
  const totalInvested = monthlyAmount * n;
  const maturityValue = monthlyAmount * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  const returns = maturityValue - totalInvested;

  const yearlyTable = [];
  for (let y = 1; y <= years; y++) {
    const months = y * 12;
    const val = monthlyAmount * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
    yearlyTable.push({
      year: y,
      invested: Math.round(monthlyAmount * months),
      value: Math.round(val),
      returns: Math.round(val - monthlyAmount * months),
    });
  }

  return {
    summary: {
      total_invested: Math.round(totalInvested),
      estimated_returns: Math.round(returns),
      maturity_value: Math.round(maturityValue),
    },
    yearly_table: yearlyTable,
    chart_data: yearlyTable.map(r => ({ year: r.year, invested: r.invested, value: r.value })),
  };
}

module.exports = { calculateSIP };