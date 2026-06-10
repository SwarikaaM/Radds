// import {
//   getProfile,
//   calculateTotals,
// } from "./financialProfile";

// export function getInvestmentCapacity() {
//   const profile = getProfile();

//   const totals =
//     calculateTotals(profile);

//   return totals.investmentCapacity;
// }

let _investmentCapacity = 0;

export function setInvestmentCapacity(value) {
  _investmentCapacity = typeof value === 'number' && value > 0 ? value : 0;
}

export function getInvestmentCapacity() {
  return _investmentCapacity;
}