// calculators/stepUpSip.js
function calculateStepUpSIP({ monthlyAmount, annualReturn, years, stepUpRate }) {
  const r = annualReturn / 100 / 12;
  let totalInvested = 0, totalValue = 0;
  const yearlyTable = [];
  let currentSIP = monthlyAmount;

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      totalInvested += currentSIP;
      totalValue = (totalValue + currentSIP) * (1 + r);
    }
    yearlyTable.push({
      year: y,
      monthly_sip: Math.round(currentSIP),
      invested: Math.round(totalInvested),
      value: Math.round(totalValue),
    });
    currentSIP = currentSIP * (1 + stepUpRate / 100);
  }

  return {
    summary: {
      total_invested: Math.round(totalInvested),
      estimated_returns: Math.round(totalValue - totalInvested),
      maturity_value: Math.round(totalValue),
    },
    yearly_table: yearlyTable,
    chart_data: yearlyTable.map(r => ({ year: r.year, invested: r.invested, value: r.value })),
  };
}
module.exports = { calculateStepUpSIP };