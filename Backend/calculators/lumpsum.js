// calculators/lumpsum.js
function calculateLumpsum({ principal, annualReturn, years }) {
  const r = annualReturn / 100;
  const maturityValue = principal * Math.pow(1 + r, years);
  const returns = maturityValue - principal;

  const yearlyTable = [];
  for (let y = 1; y <= years; y++) {
    const val = principal * Math.pow(1 + r, y);
    yearlyTable.push({ year: y, value: Math.round(val), returns: Math.round(val - principal) });
  }

  return {
    summary: {
      invested: principal,
      estimated_returns: Math.round(returns),
      maturity_value: Math.round(maturityValue),
    },
    yearly_table: yearlyTable,
    chart_data: yearlyTable.map(r => ({ year: r.year, value: r.value })),
  };
}
module.exports = { calculateLumpsum };