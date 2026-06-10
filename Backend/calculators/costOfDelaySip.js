// calculators/costOfDelaySip.js
function calculateCostOfDelaySIP({ monthlyAmount, annualReturn, years, delayYears }) {
  const r = annualReturn / 100 / 12;

  function sipValue(amount, months) {
    return amount * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
  }

  const startNow = sipValue(monthlyAmount, years * 12);
  const startLater = sipValue(monthlyAmount, (years - delayYears) * 12);
  const costOfDelay = startNow - startLater;

  return {
    summary: {
      value_if_start_now: Math.round(startNow),
      value_if_delayed: Math.round(startLater),
      cost_of_delay: Math.round(costOfDelay),
      invested_now: Math.round(monthlyAmount * years * 12),
      invested_delayed: Math.round(monthlyAmount * (years - delayYears) * 12),
    },
    yearly_table: [],
    chart_data: [
      { label: 'Start Now', value: Math.round(startNow) },
      { label: `Delay ${delayYears}yr`, value: Math.round(startLater) },
    ],
  };
}
module.exports = { calculateCostOfDelaySIP };