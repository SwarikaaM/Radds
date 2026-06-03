import {
  getProfile,
  calculateTotals,
} from "./financialProfile";

export function getInvestmentCapacity() {
  const profile = getProfile();

  const totals =
    calculateTotals(profile);

  return totals.investmentCapacity;
}