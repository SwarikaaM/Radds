import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { calculateTotals, createEmptyProfile } from '../utils/financialProfile';
import { setInvestmentCapacity } from '../utils/calculatorDefaults';

export const ProfileContext = createContext(null);
const SESSION_MINUTES = 15;

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
    } catch (err) {
      console.error('loadProfile error:', err);
      setProfile(createEmptyProfile());
    } finally {
      setLoading(false);
    }
  }, [user, token]); // eslint-disable-line

  useEffect(() => {
    setProfile(null);
    clearTimeout(sessionTimer.current);
    if (user && token) loadProfile();
    else { setProfile(null); clearTimeout(sessionTimer.current); }
    return () => clearTimeout(sessionTimer.current);
  }, [user, token]); // eslint-disable-line

  async function saveProfile(updatedProfile) {
    if (!token) return;
    if (sessionExpired) { setSessionExpired(true); return; }
    startSessionTimer();

    // Fetch current DB state to get IDs for deletes
    let raw = { income: [], expenses: [], investments: [], liabilities: [], insurance: [], children: [], child_expenses: [] };
    try {
      const rawRes = await apiFetch('/api/profile');
      if (rawRes.ok) raw = await rawRes.json();
    } catch (_) {}

    // Run all sections in parallel — wrap each in try/catch so one failure doesn't block others
    await Promise.allSettled([
      // 1. Top-level financial_profiles upsert
      (async () => {
        const ci = updatedProfile.calculatorInputs || {};
        const payload = {
          age: updatedProfile.personal?.age ? Number(updatedProfile.personal.age) : null,
          risk_preference: updatedProfile.personal?.riskPreference || null,
          date_of_plan: updatedProfile.personal?.dateOfPlan || null,
          sip_amount: Number(ci.sipAmount) || 0,
          sip_growth_rate: (Number(ci.sipGrowthRate) || 12) / 100,
          sip_start_age: Number(ci.sipStartAge) || 22,
          one_time_invest: Number(ci.oneTimeInvest) || 0,
          swp_withdrawal: Number(ci.swpWithdrawal) || 0,
          swp_corpus: Number(ci.swpCorpus) || 0,
          swp_growth_rate: (Number(ci.swpGrowthRate) || 12) / 100,
          home_loan_amount: Number(ci.homeLoanAmount) || 0,
          home_loan_emi: Number(ci.homeLoanEmi) || 0,
          home_loan_tenure: Number(ci.homeLoanTenure) || 20,
          home_loan_rate: (Number(ci.homeLoanRate) || 7.1) / 100,
          term_insurance_premium: Number(ci.termInsurancePremium) || 0,
          term_insurance_sip: Number(ci.termInsuranceSip) || 0,
          term_insurance_tenure: Number(ci.termInsuranceTenure) || 12,
          term_growth_rate: (Number(ci.termGrowthRate) || 12) / 100,
        };
        const r = await apiFetch('/api/profile', { method: 'POST', body: JSON.stringify(payload) });
        if (!r.ok) { const e = await r.json().catch(() => ({})); console.error('profile upsert error:', e); }
      })(),

      // 2. Update user display_name + phone directly
      (async () => {
        const up = updatedProfile.personal || {};
        const updates = {};
        if (up.name) updates.display_name = up.name;
        // Only save phone if it's a valid 10-digit number
        if (up.phone && /^[6-9]\d{9}$/.test(up.phone)) updates.phone = up.phone;
        if (Object.keys(updates).length === 0) return;
        const r = await apiFetch('/api/profile/user', { method: 'PATCH', body: JSON.stringify(updates) });
        if (!r.ok) { const e = await r.json().catch(() => ({})); console.error('user update error:', e); }
      })(),

      // 3. Income
      syncIncome(updatedProfile.income || {}, apiFetch, raw.income || []),

      // 4. Expenses
      syncExpenses(updatedProfile.expenses || {}, apiFetch, raw.expenses || []),

      // 5. Investments (financial + physical)
      syncInvestments(
        updatedProfile.financialAssets || [],
        updatedProfile.physicalAssets || [],
        apiFetch,
        raw.investments || []
      ),

      // 6. Liabilities
      syncLiabilities(updatedProfile.liabilities || [], apiFetch, raw.liabilities || []),

      // 7. Insurance
      syncInsurance(updatedProfile.insurance || [], apiFetch, raw.insurance || []),

      // 8. Children (sequential — must create child before creating child_expenses)
      syncChildren(updatedProfile.children || [], apiFetch, raw.children || []),
    ]);

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

// ── Map backend → frontend profile shape ─────────────────────────────
function mapBackendToProfile(data) {
  const p = data.profile || {};

  const income = { salary: 0, salary2: 0, otherIncome: 0 };
  (data.income || []).forEach(src => {
    if (src.source_type === 'salary' && !src.is_secondary) income.salary = Number(src.amount);
    else if (src.source_type === 'salary' && src.is_secondary) income.salary2 = Number(src.amount);
    else income.otherIncome += Number(src.amount);
  });

  const expKeys = ['householdExp','rent','emi','healthInsurance','insurance','bills',
                   'schoolFees','fuel','personal','existingSip','addExpenses'];
  const expenses = Object.fromEntries(expKeys.map(k => [k, 0]));
  (data.expenses || []).forEach(exp => {
    if (exp.key && exp.key in expenses) expenses[exp.key] = Number(exp.amount);
  });

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

  const financialAssets = (data.investments || [])
    .filter(i => !i.asset_class || i.asset_class === 'financial')
    .map(i => ({ id: i.id, type: i.investment_type, label: i.label, value: Number(i.current_value || 0) }));

  const physicalAssets = (data.investments || [])
    .filter(i => i.asset_class === 'physical')
    .map(i => ({ id: i.id, type: i.investment_type, label: i.label, value: Number(i.current_value || 0) }));

  const liabilities = (data.liabilities || []).map(l => ({
    id: l.id, label: l.label, loan_type: l.loan_type,
    outstanding_amount: Number(l.outstanding_amount || 0),
    emi: Number(l.emi || 0),
    interest_rate: Number(l.interest_rate || 0),
    remaining_months: Number(l.remaining_months || 0),
    is_credit_card: l.is_credit_card || false,
  }));

  const insurance = (data.insurance || []).map(i => ({
    id: i.id, policy_type: i.policy_type, provider: i.provider || '',
    cover_amount: Number(i.cover_amount || 0),
    premium: Number(i.premium || 0),
  }));

  const calculatorInputs = {
    sipAmount: Number(p.sip_amount || 0),
    sipGrowthRate: Math.round(Number(p.sip_growth_rate || 0.12) * 100),
    sipStartAge: Number(p.sip_start_age || 22),
    oneTimeInvest: Number(p.one_time_invest || 0),
    swpWithdrawal: Number(p.swp_withdrawal || 0),
    swpCorpus: Number(p.swp_corpus || 0),
    swpGrowthRate: Math.round(Number(p.swp_growth_rate || 0.12) * 100),
    homeLoanAmount: Number(p.home_loan_amount || 0),
    homeLoanEmi: Number(p.home_loan_emi || 0),
    homeLoanTenure: Number(p.home_loan_tenure || 20),
    homeLoanRate: parseFloat((Number(p.home_loan_rate || 0.071) * 100).toFixed(2)),
    termInsurancePremium: Number(p.term_insurance_premium || 0),
    termInsuranceSip: Number(p.term_insurance_sip || 0),
    termInsuranceTenure: Number(p.term_insurance_tenure || 12),
    termGrowthRate: Math.round(Number(p.term_growth_rate || 0.12) * 100),
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
    income, expenses, children, calculatorInputs,
    financialAssets, physicalAssets, liabilities, insurance,
  };
}

// ── Sync helpers ──────────────────────────────────────────────────────
async function syncIncome(income, apiFetch, existing) {
  // Delete all existing first
  await Promise.allSettled(existing.map(s =>
    apiFetch(`/api/profile/income/${s.id}`, { method: 'DELETE' })
  ));
  const inserts = [];
  if (Number(income.salary) > 0)
    inserts.push(apiFetch('/api/profile/income', { method: 'POST', body: JSON.stringify({ source_type: 'salary', label: 'Salary', amount: Number(income.salary), is_secondary: false }) }));
  if (Number(income.salary2) > 0)
    inserts.push(apiFetch('/api/profile/income', { method: 'POST', body: JSON.stringify({ source_type: 'salary', label: 'Spouse / Secondary Salary', amount: Number(income.salary2), is_secondary: true }) }));
  if (Number(income.otherIncome) > 0)
    inserts.push(apiFetch('/api/profile/income', { method: 'POST', body: JSON.stringify({ source_type: 'other', label: 'Other Income', amount: Number(income.otherIncome), is_secondary: false }) }));
  await Promise.allSettled(inserts);
}

async function syncExpenses(expenses, apiFetch, existing) {
  await Promise.allSettled(existing.map(e =>
    apiFetch(`/api/profile/expenses/${e.id}`, { method: 'DELETE' })
  ));
  const META = {
    householdExp:    { category: 'living',    label: 'House Hold Exp' },
    rent:            { category: 'housing',   label: 'Rent' },
    emi:             { category: 'housing',   label: 'EMI' },
    healthInsurance: { category: 'insurance', label: 'Health Insurance' },
    insurance:       { category: 'insurance', label: 'Insurance' },
    bills:           { category: 'utilities', label: 'Bills' },
    schoolFees:      { category: 'living',    label: 'School Fees' },
    fuel:            { category: 'transport', label: 'Fuel' },
    personal:        { category: 'lifestyle', label: 'Personal' },
    existingSip:     { category: 'other',     label: 'Existing SIP' },
    addExpenses:     { category: 'other',     label: 'Add Expenses' },
  };
  const inserts = [];
  for (const [key, amount] of Object.entries(expenses)) {
    if (Number(amount) > 0) {
      const m = META[key] || { category: 'other', label: key };
      inserts.push(apiFetch('/api/profile/expenses', {
        method: 'POST',
        body: JSON.stringify({ category: m.category, label: m.label, key, amount: Number(amount) }),
      }));
    }
  }
  await Promise.allSettled(inserts);
}

async function syncInvestments(financialAssets, physicalAssets, apiFetch, existing) {
  await Promise.allSettled(existing.map(i =>
    apiFetch(`/api/profile/investments/${i.id}`, { method: 'DELETE' })
  ));
  const inserts = [];
  for (const asset of financialAssets) {
    if (Number(asset.value) > 0 || asset.label) {
      inserts.push(apiFetch('/api/profile/investments', {
        method: 'POST',
        body: JSON.stringify({
          investment_type: asset.type || 'other',
          label: asset.label || asset.type,
          current_value: Number(asset.value) || 0,
          asset_class: 'financial',
        }),
      }));
    }
  }
  for (const asset of physicalAssets) {
    if (Number(asset.value) > 0 || asset.label) {
      inserts.push(apiFetch('/api/profile/investments', {
        method: 'POST',
        body: JSON.stringify({
          investment_type: asset.type || 'real_estate',
          label: asset.label || asset.type,
          current_value: Number(asset.value) || 0,
          asset_class: 'physical',
        }),
      }));
    }
  }
  await Promise.allSettled(inserts);
}

async function syncLiabilities(liabilities, apiFetch, existing) {
  await Promise.allSettled(existing.map(l =>
    apiFetch(`/api/profile/liabilities/${l.id}`, { method: 'DELETE' })
  ));
  const inserts = liabilities
    .filter(l => Number(l.outstanding_amount) > 0 || Number(l.emi) > 0)
    .map(l => apiFetch('/api/profile/liabilities', {
      method: 'POST',
      body: JSON.stringify({
        label: l.label || l.loan_type,
        loan_type: l.loan_type,
        outstanding_amount: Number(l.outstanding_amount) || 0,
        emi: Number(l.emi) || 0,
        interest_rate: Number(l.interest_rate) || 0,
        remaining_months: Number(l.remaining_months) || 0,
        is_credit_card: !!l.is_credit_card,
      }),
    }));
  await Promise.allSettled(inserts);
}

async function syncInsurance(insurance, apiFetch, existing) {
  await Promise.allSettled(existing.map(i =>
    apiFetch(`/api/profile/insurance/${i.id}`, { method: 'DELETE' })
  ));
  const inserts = insurance
    .filter(i => Number(i.premium) > 0 || Number(i.cover_amount) > 0)
    .map(i => apiFetch('/api/profile/insurance', {
      method: 'POST',
      body: JSON.stringify({
        policy_type: i.policy_type,
        provider: i.provider || '',
        cover_amount: Number(i.cover_amount) || 0,
        premium: Number(i.premium) || 0,
      }),
    }));
  await Promise.allSettled(inserts);
}

async function syncChildren(children, apiFetch, existingChildren) {
  // Delete all existing children (child_expenses cascade)
  await Promise.allSettled(existingChildren.map(c =>
    apiFetch(`/api/profile/children/${c.id}`, { method: 'DELETE' })
  ));
  // Re-insert sequentially (need child ID before inserting expenses)
  for (const child of children) {
    try {
      const res = await apiFetch('/api/profile/children', {
        method: 'POST',
        body: JSON.stringify({ name: child.name || 'Child', age: Number(child.age) || 0 }),
      });
      if (res.ok) {
        const created = await res.json();
        await apiFetch(`/api/profile/children/${created.id}/expenses`, {
          method: 'PUT',
          body: JSON.stringify({
            education: Number(child.education) || 0,
            allowance: Number(child.allowance) || 0,
            holiday: Number(child.holiday) || 0,
            medical: Number(child.medical) || 0,
          }),
        });
      }
    } catch (err) {
      console.error('syncChildren error:', err);
    }
  }
}
