import { sipConfig, calcSIP, buildSIPChartData } from "../calculators/sip";
import { swpConfig, calcSWP, buildSWPChartData } from "../calculators/swp";
import { costOfDelayConfig, calcCostOfDelay, buildCostOfDelayChartData } from "../calculators/costOfDelaySip";
import { lumpsumConfig, calcLumpsum, buildLumpsumChartData } from "../calculators/lumpsum";
import { stepUpSIPConfig, calcStepUpSIP, buildStepUpSIPChartData } from "../calculators/stepUpSip";
import { oneTimeConfig, calcOneTime, buildOneTimeChartData } from "../calculators/oneTimeInvestment";
import { getInvestmentCapacity } from "../utils/calculatorDefaults";

/**
 * Each entry wraps a config + compute + chartData function.
 * CalculatorDetail calls registry[slug] to get everything it needs.
 */

function getProfileDefaultValue(fieldKey, defaultValue) {
  const investmentCapacity = getInvestmentCapacity();

  if (
    !Number.isFinite(investmentCapacity) ||
    investmentCapacity <= 0
  ) {
    return defaultValue;
  }

  if (
    fieldKey === "monthly" ||
    fieldKey === "initialMonthly"
  ) {
    return investmentCapacity;
  }

  return defaultValue;
}

export const calculatorRegistry = {
  sip: {
    ...sipConfig,
    compute: (vals) => calcSIP(vals.monthly, vals.annualRate, vals.years),
    buildChartData: (vals) => buildSIPChartData(vals.monthly, vals.annualRate, vals.years),
  },
  swp: {
    ...swpConfig,
    compute: (vals) => calcSWP(vals.corpus, vals.monthly, vals.annualRate, vals.years),
    buildChartData: (vals) => buildSWPChartData(vals.corpus, vals.monthly, vals.annualRate, vals.years),
  },
  "cost-of-delay-sip": {
    ...costOfDelayConfig,
    compute: (vals) => calcCostOfDelay(vals.monthly, vals.annualRate, vals.years, vals.delayYears),
    buildChartData: (vals) => buildCostOfDelayChartData(vals.monthly, vals.annualRate, vals.years, vals.delayYears),
  },
  lumpsum: {
    ...lumpsumConfig,
    compute: (vals) => calcLumpsum(vals.principal, vals.annualRate, vals.years),
    buildChartData: (vals) => buildLumpsumChartData(vals.principal, vals.annualRate, vals.years),
  },
  "step-up-sip": {
    ...stepUpSIPConfig,
    compute: (vals) => calcStepUpSIP(vals.initialMonthly, vals.annualRate, vals.years, vals.annualStepUp),
    buildChartData: (vals) => buildStepUpSIPChartData(vals.initialMonthly, vals.annualRate, vals.years, vals.annualStepUp),
  },
  "one-time-investment": {
    ...oneTimeConfig,
    compute: (vals) => calcOneTime(vals.principal, vals.annualRate, vals.years),
    buildChartData: (vals) => buildOneTimeChartData(vals.principal, vals.annualRate, vals.years),
  },
};

/** Build the initial values object from a config's inputs array */
export function getDefaultValues(config) {
  return Object.fromEntries(
    config.inputs.map((inp) => [
      inp.key,
      getProfileDefaultValue(
        inp.key,
        inp.default
      ),
    ])
  );
}
