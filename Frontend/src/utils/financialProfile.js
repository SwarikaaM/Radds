// src/utils/financialProfile.js
// All data comes from backend API via ProfileContext — no localStorage

export const DEFAULT_PROFILE = Object.freeze({
  personal: {
    name: '', email: '', phone: '',
    age: '', riskPreference: '', dateOfPlan: '',
    children: 0,
  },
  children: [],
  income: {
    salary: 0,
    salary2: 0,      // Spouse / Second Salary
    otherIncome: 0,
  },
  expenses: {
    householdExp: 0,
    rent: 0,
    emi: 0,
    healthInsurance: 0,
    insurance: 0,
    bills: 0,
    schoolFees: 0,
    fuel: 0,
    personal: 0,
    existingSip: 0,
    addExpenses: 0,
  },
  // Calculator inputs (used for 5-sheet export)
  calculatorInputs: {
    sipAmount: 0,
    sipGrowthRate: 12,
    sipStartAge: 22,
    oneTimeInvest: 0,
    swpWithdrawal: 0,
    swpCorpus: 0,
    swpGrowthRate: 12,
    homeLoanAmount: 0,
    homeLoanEmi: 0,
    homeLoanTenure: 20,
    homeLoanRate: 7.1,
    termInsurancePremium: 0,
    termInsuranceSip: 0,
    termInsuranceTenure: 12,
    termGrowthRate: 12,
  },
  // Net Worth — dynamic arrays
  financialAssets: [],   // [{ id?, type, label, value }]
  physicalAssets: [],    // [{ id?, type, label, value }]
  liabilities: [],       // [{ id?, label, loan_type, outstanding_amount, emi, interest_rate, remaining_months, is_credit_card }]
  insurance: [],         // [{ id?, policy_type, provider, cover_amount, premium }]
});

function safeNum(v) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function calculateTotals(profile) {
  if (!profile) return { totalIncome: 0, totalExpenses: 0, investmentCapacity: 0, deficit: 0, childExpenses: 0, baseExpenses: 0 };

  const totalIncome = Object.values(profile.income || {}).reduce((s, v) => s + safeNum(v), 0);

  const childExpenses = (profile.children || []).reduce((t, c) =>
    t + safeNum(c.education) + safeNum(c.allowance) + safeNum(c.holiday) + safeNum(c.medical), 0);

  const baseExpenses = Object.values(profile.expenses || {}).reduce((s, v) => s + safeNum(v), 0);
  const totalExpenses = baseExpenses + childExpenses;
  const investmentCapacity = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    baseExpenses,
    childExpenses,
    investmentCapacity: investmentCapacity > 0 ? investmentCapacity : 0,
    deficit: investmentCapacity < 0 ? Math.abs(investmentCapacity) : 0,
  };
}

export function createEmptyProfile() {
  return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
}