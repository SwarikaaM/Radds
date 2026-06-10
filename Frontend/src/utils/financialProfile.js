// src/utils/financialProfile.js
// All data now comes from backend API, not localStorage
// This file only has calculateTotals — no more localStorage

export const DEFAULT_PROFILE = Object.freeze({
  personal: { name: '', email: '', phone: '', age: '', children: 0 },
  children: [],
  income: {
    salary: 0, businessIncome: 0, rentalIncome: 0,
    investmentIncome: 0, otherIncome: 0,
  },
  expenses: {
    rent: 0, maintenance: 0, electricity: 0, water: 0, internet: 0,
    groceries: 0, transport: 0, fuel: 0, medical: 0,
    lifeInsurance: 0, healthInsurance: 0, vehicleInsurance: 0,
    entertainment: 0, travel: 0, other: 0,
  },
});

function safeNumber(value) {
  const n = Number(value);
  return Number.isNaN(n) || !Number.isFinite(n) ? 0 : Math.max(0, n);
}

export function calculateTotals(profile) {
  const totalIncome = Object.values(profile?.income || {})
    .reduce((sum, v) => sum + safeNumber(v), 0);

  const totalExpenses = Object.values(profile?.expenses || {})
    .reduce((sum, v) => sum + safeNumber(v), 0);

  const childExpenses = (profile?.children || []).reduce((total, child) =>
    total + safeNumber(child.education) + safeNumber(child.allowance) +
    safeNumber(child.holiday) + safeNumber(child.medical), 0);

  const grandExpenses = totalExpenses + childExpenses;
  const investmentCapacity = totalIncome - grandExpenses;

  return {
    totalIncome,
    totalExpenses: grandExpenses,
    baseExpenses: totalExpenses,
    childExpenses,
    investmentCapacity: investmentCapacity > 0 ? investmentCapacity : 0,
    deficit: investmentCapacity < 0 ? Math.abs(investmentCapacity) : 0,
  };
}

// Kept for backward compatibility — returns 0 if no profile in context
export function createEmptyProfile() {
  return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
}