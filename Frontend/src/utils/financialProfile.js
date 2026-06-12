// ── Default empty profile shape ────────────────────────────────────────
export function createEmptyProfile() {
  return {
    personal: {
      name: '', email: '', phone: '',
      age: '', riskPreference: '', dateOfPlan: '', children: 0,
    },
    income: { salary: 0, salary2: 0, otherIncome: 0 },
    expenses: {
      householdExp: 0, rent: 0, emi: 0, healthInsurance: 0,
      insurance: 0, bills: 0, schoolFees: 0, fuel: 0,
      personal: 0, existingSip: 0, addExpenses: 0,
    },
    children: [],
    calculatorInputs: {
      sipAmount: 0, sipGrowthRate: 12, sipStartAge: 22,
      oneTimeInvest: 0,
      swpWithdrawal: 0, swpCorpus: 0, swpGrowthRate: 12,
      homeLoanAmount: 0, homeLoanEmi: 0, homeLoanTenure: 20, homeLoanRate: 7.1,
      termInsurancePremium: 0, termInsuranceSip: 0,
      termInsuranceTenure: 12, termGrowthRate: 12,
    },
    financialAssets: [],
    physicalAssets: [],
    liabilities: [],
    insurance: [],
  };
}

export const DEFAULT_PROFILE = createEmptyProfile();

// ── Calculate totals from the frontend profile shape ───────────────────
export function calculateTotals(profile) {
  if (!profile) return { totalIncome: 0, totalExpenses: 0, investmentCapacity: 0, childExpenses: 0, deficit: 0 };

  const totalIncome =
    Number(profile.income?.salary || 0) +
    Number(profile.income?.salary2 || 0) +
    Number(profile.income?.otherIncome || 0);

  const exp = profile.expenses || {};
  const totalExpenses =
    Number(exp.householdExp || 0) + Number(exp.rent || 0) + Number(exp.emi || 0) +
    Number(exp.healthInsurance || 0) + Number(exp.insurance || 0) + Number(exp.bills || 0) +
    Number(exp.schoolFees || 0) + Number(exp.fuel || 0) + Number(exp.personal || 0) +
    Number(exp.existingSip || 0) + Number(exp.addExpenses || 0);

  const childExpenses = (profile.children || []).reduce((sum, c) => {
    return sum + Number(c.education || 0) + Number(c.allowance || 0) +
           Number(c.holiday || 0) + Number(c.medical || 0);
  }, 0);

  const balance = totalIncome - totalExpenses - childExpenses;
  const investmentCapacity = Math.max(0, balance);
  const deficit = balance < 0 ? Math.abs(balance) : 0;

  return { totalIncome, totalExpenses, childExpenses, investmentCapacity, deficit };
}

