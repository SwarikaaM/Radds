import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { calculateTotals, createEmptyProfile } from '../utils/financialProfile';
import { setInvestmentCapacity } from '../utils/calculatorDefaults';

const ProfileContext = createContext(null);
const SESSION_MINUTES = 15;

export function ProfileProvider({ children }) {
  const { user, token, apiFetch, logout } = useAuth();
  const [profile, setProfile] = useState(null); // null = not loaded yet
  const [loading, setLoading] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const sessionTimer = useRef(null);

  // Start 15-min session timer
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

  // Load profile from backend when user logs in
  const loadProfile = useCallback(async () => {
    if (!user || !token) { setProfile(null); return; }
    setLoading(true);
    try {
      const res = await apiFetch('/api/profile');
      if (!res.ok) { setProfile(createEmptyProfile()); return; }
      const data = await res.json();
      // Map backend structure to frontend profile shape
      const mapped = mapBackendToProfile(data);
      setProfile(mapped);

        if (mapped) {
        const t = calculateTotals(mapped);
        setInvestmentCapacity(t.investmentCapacity);
        }

      startSessionTimer();
    } catch {
      setProfile(createEmptyProfile());
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    if (user && token) loadProfile();
    else { setProfile(null); clearTimeout(sessionTimer.current); }
    return () => clearTimeout(sessionTimer.current);
  }, [user, token]);

  // Save profile to backend
  async function saveProfile(updatedProfile) {
    if (!token) return;
    if (sessionExpired) { setSessionExpired(true); return; }
    startSessionTimer(); // reset timer on activity

    // Upsert top-level profile
    await apiFetch('/api/profile', {
      method: 'POST',
      body: JSON.stringify({
        age: updatedProfile.personal?.age || null,
        risk_preference: updatedProfile.personal?.riskPreference || null,
      }),
    });

    // Sync income sources — delete all then re-insert (simplest approach)
    // In production you would diff, but for this scale this is fine
    await syncIncomeToBackend(updatedProfile.income, apiFetch);
    await syncExpensesToBackend(updatedProfile.expenses, apiFetch);

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

export const useProfile = () => useContext(ProfileContext);

// ── Map backend API response to frontend profile shape ───────────────
function mapBackendToProfile(data) {
  const income = {
    salary: 0, businessIncome: 0, rentalIncome: 0, investmentIncome: 0, otherIncome: 0,
  };
  (data.income || []).forEach(src => {
    if (src.source_type === 'salary') income.salary = Number(src.amount);
    else if (src.source_type === 'business') income.businessIncome = Number(src.amount);
    else if (src.source_type === 'rental') income.rentalIncome = Number(src.amount);
    else if (src.source_type === 'investment') income.investmentIncome = Number(src.amount);
    else income.otherIncome = (income.otherIncome || 0) + Number(src.amount);
  });

  const expenses = {
    rent: 0, maintenance: 0, electricity: 0, water: 0, internet: 0,
    groceries: 0, transport: 0, fuel: 0, medical: 0,
    lifeInsurance: 0, healthInsurance: 0, vehicleInsurance: 0,
    entertainment: 0, travel: 0, other: 0,
  };
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

  return {
    personal: {
      name: data.user?.display_name || '',
      email: data.user?.email || '',
      phone: data.user?.phone || '',
      age: data.profile?.age || '',
      children: children.length,
      riskPreference: data.profile?.risk_preference || '',
    },
    income,
    expenses,
    children,
    // Keep raw backend data for export
    _raw: data,
  };
}

// ── Sync helpers ─────────────────────────────────────────────────────
async function syncIncomeToBackend(income, apiFetch) {
  // Fetch existing income sources
  const res = await apiFetch('/api/profile');
  if (!res.ok) return;
  const data = await res.json();

  // Delete existing
  for (const src of (data.income || [])) {
    await apiFetch(`/api/profile/income/${src.id}`, { method: 'DELETE' });
  }

  // Re-insert non-zero values
  const map = [
    ['salary', 'salary', 'Salary'],
    ['businessIncome', 'business', 'Business Income'],
    ['rentalIncome', 'rental', 'Rental Income'],
    ['investmentIncome', 'investment', 'Investment Income'],
    ['otherIncome', 'other', 'Other Income'],
  ];
  for (const [key, type, label] of map) {
    if (income[key] > 0) {
      await apiFetch('/api/profile/income', {
        method: 'POST',
        body: JSON.stringify({ source_type: type, label, amount: income[key] }),
      });
    }
  }
}

async function syncExpensesToBackend(expenses, apiFetch) {
  const res = await apiFetch('/api/profile');
  if (!res.ok) return;
  const data = await res.json();

  for (const exp of (data.expenses || [])) {
    await apiFetch(`/api/profile/expenses/${exp.id}`, { method: 'DELETE' });
  }

  const categoryMap = {
    rent: 'housing', maintenance: 'housing',
    electricity: 'utilities', water: 'utilities', internet: 'utilities',
    groceries: 'living',
    transport: 'transport', fuel: 'transport',
    medical: 'medical',
    lifeInsurance: 'insurance', healthInsurance: 'insurance', vehicleInsurance: 'insurance',
    entertainment: 'lifestyle', travel: 'lifestyle', other: 'lifestyle',
  };
  const labelMap = {
    rent: 'Rent / EMI', maintenance: 'Maintenance',
    electricity: 'Electricity', water: 'Water', internet: 'Internet',
    groceries: 'Groceries', transport: 'Transport', fuel: 'Fuel',
    medical: 'Medical', lifeInsurance: 'Life Insurance',
    healthInsurance: 'Health Insurance', vehicleInsurance: 'Vehicle Insurance',
    entertainment: 'Entertainment', travel: 'Travel', other: 'Other Expenses',
  };

  for (const [key, amount] of Object.entries(expenses)) {
    if (amount > 0) {
      await apiFetch('/api/profile/expenses', {
        method: 'POST',
        body: JSON.stringify({
          category: categoryMap[key] || 'other',
          label: labelMap[key] || key,
          key,
          amount,
        }),
      });
    }
  }
}