import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { calculateTotals, createEmptyProfile } from '../utils/financialProfile';
import { setInvestmentCapacity } from '../utils/calculatorDefaults';

export const ProfileContext = createContext(null);
const SESSION_MINUTES = 15;

// ── Exported hook (separate from provider to fix Vite HMR) ────────────
// export function useProfile() {
//   return useContext(ProfileContext);
// }

// ── Provider ──────────────────────────────────────────────────────────
export function ProfileProvider({ children }) {
  const { user, token, apiFetch, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const sessionTimer = useRef(null);

  function startSessionTimer() {
    clearTimeout(sessionTimer.current);
    const expiry = Date.now() + SESSION_MINUTES * 60 * 1000;
    setSessionExpiry(expiry);
    setSessionExpired(false);
    sessionTimer.current = setTimeout(() => {
      setSessionExpired(true);
      setProfile(null);
    }, SESSION_MINUTES * 60 * 1000);
  }

  const loadProfile = useCallback(async () => {
    if (!user || !token) { setProfile(null); return; }
    setLoading(true);
    try {
      const res = await apiFetch('/api/profile');
      if (!res.ok) { setProfile(createEmptyProfile()); return; }
      const data = await res.json();
      const mapped = mapBackendToProfile(data);
      setProfile(mapped);
      const t = calculateTotals(mapped);
      setInvestmentCapacity(t.investmentCapacity);
      startSessionTimer();
    } catch {
      setProfile(createEmptyProfile());
    } finally {
      setLoading(false);
    }
  }, [user, token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user && token) loadProfile();
    else { setProfile(null); clearTimeout(sessionTimer.current); }
    return () => clearTimeout(sessionTimer.current);
  }, [user, token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save profile — single fetch at start, pass raw IDs to sync helpers
  async function saveProfile(updatedProfile) {
    if (!token) return;
    if (sessionExpired) { setSessionExpired(true); return; }
    startSessionTimer();

    // 1. Fetch current IDs once — used by all sync helpers
    const rawRes = await apiFetch('/api/profile');
    const raw = rawRes.ok ? await rawRes.json() : { income: [], expenses: [], investments: [], liabilities: [], insurance: [], children: [] };

    // 2. Upsert top-level financial_profile fields
    const ci = updatedProfile.calculatorInputs || {};
    await apiFetch('/api/profile', {
      method: 'POST',
      body: JSON.stringify({
        age: updatedProfile.personal?.age ? Number(updatedProfile.personal.age) : null,
        risk_preference: updatedProfile.personal?.riskPreference || null,
        date_of_plan: updatedProfile.personal?.dateOfPlan || null,
        sip_amount: ci.sipAmount || 0,
        sip_growth_rate: (ci.sipGrowthRate || 12) / 100,
        sip_start_age: ci.sipStartAge || 22,
        one_time_invest: ci.oneTimeInvest || 0,
        swp_withdrawal: ci.swpWithdrawal || 0,
        swp_corpus: ci.swpCorpus || 0,
        swp_growth_rate: (ci.swpGrowthRate || 12) / 100,
        home_loan_amount: ci.homeLoanAmount || 0,
        home_loan_emi: ci.homeLoanEmi || 0,
        home_loan_tenure: ci.homeLoanTenure || 20,
        home_loan_rate: (ci.homeLoanRate || 7.1) / 100,
        term_insurance_premium: ci.termInsurancePremium || 0,
        term_insurance_sip: ci.termInsuranceSip || 0,
        term_insurance_tenure: ci.termInsuranceTenure || 12,
        term_growth_rate: (ci.termGrowthRate || 12) / 100,
      }),
    });

    // 3. Sync income
    await syncIncome(updatedProfile.income, apiFetch, raw.income || []);
    // 4. Sync expenses
    await syncExpenses(updatedProfile.expenses, apiFetch, raw.expenses || []);
    // 5. Sync investments (financial + physical assets)
    await syncInvestments(updatedProfile.financialAssets || [], updatedProfile.physicalAssets || [], apiFetch, raw.investments || []);
    // 6. Sync liabilities
    await syncLiabilities(updatedProfile.liabilities || [], apiFetch, raw.liabilities || []);
    // 7. Sync insurance
    await syncInsurance(updatedProfile.insurance || [], apiFetch, raw.insurance || []);
    // 8. Sync children
    await syncChildren(updatedProfile.children || [], apiFetch, raw.children || [], raw.child_expenses || []);

    // 9. Update display_name/phone in user_profiles if changed
    const up = updatedProfile.personal;
    if (up?.name) {
      await apiFetch('/api/profile/change-request', {
        method: 'POST',
        body: JSON.stringify({ field_name: 'display_name', requested_value: up.name }),
      }).catch(() => {}); // non-blocking, may already be same value
    }

    // Update local state
    const totals = calculateTotals(updatedProfile);
    setInvestmentCapacity(totals.investmentCapacity);
    setProfile(updatedProfile);
  }

  const totals = profile ? calculateTotals(profile) : null;
  const hasProfile = !!(profile?.personal?.name || profile?.income?.salary);

  function reauth() {
    setSessionExpired(false);
    logout();
  }

  return (
    <ProfileContext.Provider value={{
      profile, setProfile, saveProfile, loadProfile,
      loading, totals, hasProfile,
      sessionExpired, sessionExpiry, reauth,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

// ── Map backend → frontend ────────────────────────────────────────────
function mapBackendToProfile(data) {
  const p = data.profile || {};

  // Income
  const income = { salary: 0, salary2: 0, otherIncome: 0 };
  (data.income || []).forEach(src => {
    if (src.source_type === 'salary' && !src.is_secondary) income.salary = Number(src.amount);
    else if (src.source_type === 'salary' && src.is_secondary) income.salary2 = Number(src.amount);
    else income.otherIncome += Number(src.amount);
  });

  // Expenses — keyed by `key` field in DB
  const expKeys = ['householdExp','rent','emi','healthInsurance','insurance','bills','schoolFees','fuel','personal','existingSip','addExpenses'];
  const expenses = Object.fromEntries(expKeys.map(k => [k, 0]));
  (data.expenses || []).forEach(exp => {
    if (exp.key && exp.key in expenses) expenses[exp.key] = Number(exp.amount);
  });

  // Children
  const children = (data.children || []).map(child => {
    const exp = (data.child_expenses || []).find(e => e.child_id === child.id) || {};
    return {
      id: child.id,
      name: child.name,
      age: child.age,
      education: Number(exp.education || 0),
      allowance: Number(exp.allowance || 0),
      holiday: Number(exp.holiday || 0),
      medical: Number(exp.medical || 0),
    };
  });

  // Financial assets (investment_type, asset_class='financial')
  const financialAssets = (data.investments || [])
    .filter(i => !i.asset_class || i.asset_class === 'financial')
    .map(i => ({ id: i.id, type: i.investment_type, label: i.label, value: Number(i.current_value || 0) }));

  // Physical assets (asset_class='physical')
  const physicalAssets = (data.investments || [])
    .filter(i => i.asset_class === 'physical')
    .map(i => ({ id: i.id, type: i.investment_type, label: i.label, value: Number(i.current_value || 0) }));

  // Liabilities
  const liabilities = (data.liabilities || []).map(l => ({
    id: l.id,
    label: l.label,
    loan_type: l.loan_type,
    outstanding_amount: Number(l.outstanding_amount || 0),
    emi: Number(l.emi || 0),
    interest_rate: Number(l.interest_rate || 0),
    remaining_months: Number(l.remaining_months || 0),
    is_credit_card: l.is_credit_card || false,
  }));

  // Insurance
  const insurance = (data.insurance || []).map(i => ({
    id: i.id,
    policy_type: i.policy_type,
    provider: i.provider || '',
    cover_amount: Number(i.cover_amount || 0),
    premium: Number(i.premium || 0),
  }));

  // Calculator inputs (stored in financial_profiles, rates stored as decimals in DB)
  const calculatorInputs = {
    sipAmount: Number(p.sip_amount || 0),
    sipGrowthRate: Math.round((Number(p.sip_growth_rate || 0.12)) * 100),
    sipStartAge: Number(p.sip_start_age || 22),
    oneTimeInvest: Number(p.one_time_invest || 0),
    swpWithdrawal: Number(p.swp_withdrawal || 0),
    swpCorpus: Number(p.swp_corpus || 0),
    swpGrowthRate: Math.round((Number(p.swp_growth_rate || 0.12)) * 100),
    homeLoanAmount: Number(p.home_loan_amount || 0),
    homeLoanEmi: Number(p.home_loan_emi || 0),
    homeLoanTenure: Number(p.home_loan_tenure || 20),
    homeLoanRate: parseFloat(((Number(p.home_loan_rate || 0.071)) * 100).toFixed(2)),
    termInsurancePremium: Number(p.term_insurance_premium || 0),
    termInsuranceSip: Number(p.term_insurance_sip || 0),
    termInsuranceTenure: Number(p.term_insurance_tenure || 12),
    termGrowthRate: Math.round((Number(p.term_growth_rate || 0.12)) * 100),
  };

  return {
    personal: {
      name: data.user?.display_name || '',
      email: data.user?.email || '',
      phone: data.user?.phone || '',
      age: p.age || '',
      riskPreference: p.risk_preference || '',
      dateOfPlan: p.date_of_plan ? p.date_of_plan.split('T')[0] : '',
      children: children.length,
    },
    income,
    expenses,
    children,
    calculatorInputs,
    financialAssets,
    physicalAssets,
    liabilities,
    insurance,
  };
}

// ── Sync helpers ──────────────────────────────────────────────────────
async function syncIncome(income, apiFetch, existing) {
  for (const src of existing) {
    await apiFetch(`/api/profile/income/${src.id}`, { method: 'DELETE' });
  }
  if (income.salary > 0)
    await apiFetch('/api/profile/income', { method: 'POST', body: JSON.stringify({ source_type: 'salary', label: 'Salary', amount: income.salary, is_secondary: false }) });
  if (income.salary2 > 0)
    await apiFetch('/api/profile/income', { method: 'POST', body: JSON.stringify({ source_type: 'salary', label: 'Spouse / Second Salary', amount: income.salary2, is_secondary: true }) });
  if (income.otherIncome > 0)
    await apiFetch('/api/profile/income', { method: 'POST', body: JSON.stringify({ source_type: 'other', label: 'Other Income', amount: income.otherIncome, is_secondary: false }) });
}

async function syncExpenses(expenses, apiFetch, existing) {
  for (const exp of existing) {
    await apiFetch(`/api/profile/expenses/${exp.id}`, { method: 'DELETE' });
  }
  const META = {
    householdExp:   { category: 'living',    label: 'House Hold Exp' },
    rent:           { category: 'housing',   label: 'Rent' },
    emi:            { category: 'housing',   label: 'EMI' },
    healthInsurance:{ category: 'insurance', label: 'Health Insurance' },
    insurance:      { category: 'insurance', label: 'Insurance' },
    bills:          { category: 'utilities', label: 'Bills' },
    schoolFees:     { category: 'living',    label: 'School Fees' },
    fuel:           { category: 'transport', label: 'Fuel' },
    personal:       { category: 'lifestyle', label: 'Personal' },
    existingSip:    { category: 'other',     label: 'Existing SIP' },
    addExpenses:    { category: 'other',     label: 'Add Expenses' },
  };
  for (const [key, amount] of Object.entries(expenses)) {
    if (amount > 0) {
      const m = META[key] || { category: 'other', label: key };
      await apiFetch('/api/profile/expenses', {
        method: 'POST',
        body: JSON.stringify({ category: m.category, label: m.label, key, amount }),
      });
    }
  }
}

async function syncInvestments(financialAssets, physicalAssets, apiFetch, existing) {
  for (const inv of existing) {
    await apiFetch(`/api/profile/investments/${inv.id}`, { method: 'DELETE' });
  }
  for (const asset of financialAssets) {
    if (asset.value > 0 || asset.label) {
      await apiFetch('/api/profile/investments', {
        method: 'POST',
        body: JSON.stringify({
          investment_type: asset.type || 'other',
          label: asset.label || asset.type,
          current_value: asset.value || 0,
          asset_class: 'financial',
        }),
      });
    }
  }
  for (const asset of physicalAssets) {
    if (asset.value > 0 || asset.label) {
      await apiFetch('/api/profile/investments', {
        method: 'POST',
        body: JSON.stringify({
          investment_type: asset.type || 'real_estate',
          label: asset.label || asset.type,
          current_value: asset.value || 0,
          asset_class: 'physical',
        }),
      });
    }
  }
}

async function syncLiabilities(liabilities, apiFetch, existing) {
  for (const l of existing) {
    await apiFetch(`/api/profile/liabilities/${l.id}`, { method: 'DELETE' });
  }
  for (const l of liabilities) {
    if (l.outstanding_amount > 0 || l.emi > 0) {
      await apiFetch('/api/profile/liabilities', {
        method: 'POST',
        body: JSON.stringify({
          label: l.label || l.loan_type,
          loan_type: l.loan_type,
          outstanding_amount: l.outstanding_amount || 0,
          emi: l.emi || 0,
          interest_rate: l.interest_rate || 0,
          remaining_months: l.remaining_months || 0,
          is_credit_card: l.is_credit_card || false,
        }),
      });
    }
  }
}

async function syncInsurance(insurance, apiFetch, existing) {
  for (const ins of existing) {
    await apiFetch(`/api/profile/insurance/${ins.id}`, { method: 'DELETE' });
  }
  for (const ins of insurance) {
    if (ins.premium > 0 || ins.cover_amount > 0) {
      await apiFetch('/api/profile/insurance', {
        method: 'POST',
        body: JSON.stringify({
          policy_type: ins.policy_type,
          provider: ins.provider || '',
          cover_amount: ins.cover_amount || 0,
          premium: ins.premium || 0,
        }),
      });
    }
  }
}

async function syncChildren(children, apiFetch, existingChildren, existingChildExpenses) {
  // Delete all existing children (cascade deletes child_expenses)
  for (const c of existingChildren) {
    await apiFetch(`/api/profile/children/${c.id}`, { method: 'DELETE' });
  }
  // Re-insert
  for (const child of children) {
    const res = await apiFetch('/api/profile/children', {
      method: 'POST',
      body: JSON.stringify({ name: child.name || 'Child', age: child.age || 0 }),
    });
    if (res.ok) {
      const created = await res.json();
      await apiFetch(`/api/profile/children/${created.id}/expenses`, {
        method: 'PUT',
        body: JSON.stringify({
          education: child.education || 0,
          allowance: child.allowance || 0,
          holiday: child.holiday || 0,
          medical: child.medical || 0,
        }),
      });
    }
  }
}