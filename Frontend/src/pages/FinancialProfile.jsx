import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/useProfile';
import { calculateTotals, createEmptyProfile } from '../utils/financialProfile';
import Button from '../components/ui/Button';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import ErrorPage from './ErrorPage';

// ── Numeric input that lets you clear the field ───────────────────────
function NumInput({ value, onChange, placeholder = '0', prefix = '₹', suffix = '' }) {
  const [raw, setRaw] = useState(value === 0 ? '' : String(value));
  useEffect(() => { setRaw(value === 0 ? '' : String(value)); }, [value]);
  function handleChange(e) {
    const v = e.target.value;
    if (v === '' || /^\d*\.?\d*$/.test(v)) { setRaw(v); onChange(v === '' ? 0 : Number(v)); }
  }
  return (
    <div className="flex items-center border border-[#D1DDE8] rounded-lg bg-white focus-within:border-[#22568F] focus-within:shadow-[0_0_0_3px_rgba(34,86,143,0.08)]">
      {prefix && <span className="pl-3 text-[#6B7E99] text-sm select-none">{prefix}</span>}
      <input
        type="text" inputMode="numeric" value={raw} onChange={handleChange}
        onFocus={e => { if (e.target.value === '0') { setRaw(''); } }}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none p-3 pl-1.5 text-sm font-semibold text-[#0D1B2E]"
      />
      {suffix && <span className="pr-3 text-[#6B7E99] text-sm select-none">{suffix}</span>}
    </div>
  );
}

// ── Collapsible section wrapper ───────────────────────────────────────
function Section({ title, defaultOpen = false, children, highlight = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-xl border mt-6 overflow-hidden ${highlight ? 'border-[#22568F]' : 'border-[#E2EBF5]'} bg-white`}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8FAFC] transition-colors">
        <h2 className="font-semibold text-base text-[#0D1B2E]">{title}</h2>
        {open ? <ChevronUp size={18} className="text-[#6B7E99]" /> : <ChevronDown size={18} className="text-[#6B7E99]" />}
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

// ── Labelled field wrapper ────────────────────────────────────────────
function Field({ label, children, half = false }) {
  return (
    <div className={half ? 'md:col-span-1' : ''}>
      <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">{label}</label>
      {children}
    </div>
  );
}

// ── Dynamic row list (for Net Worth assets) ───────────────────────────
function DynamicRows({ rows, onChange, typeOptions, labelPlaceholder = 'Description' }) {
  function update(i, field, val) {
    const updated = rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r);
    onChange(updated);
  }
  function add() {
    onChange([...rows, { type: typeOptions[0].value, label: '', value: 0 }]);
  }
  function remove(i) {
    onChange(rows.filter((_, idx) => idx !== i));
  }
  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
          <div>
            {i === 0 && <p className="text-xs text-[#6B7E99] mb-1">Category</p>}
            <select value={row.type} onChange={e => update(i, 'type', e.target.value)}
              className="w-full border border-[#D1DDE8] rounded-lg p-2.5 text-sm bg-white">
              {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            {i === 0 && <p className="text-xs text-[#6B7E99] mb-1">Details</p>}
            <input type="text" placeholder={labelPlaceholder} value={row.label}
              onChange={e => update(i, 'label', e.target.value)}
              className="w-full border border-[#D1DDE8] rounded-lg p-2.5 text-sm" />
          </div>
          <div>
            {i === 0 && <p className="text-xs text-[#6B7E99] mb-1">Value (₹)</p>}
            <NumInput value={row.value} onChange={v => update(i, 'value', v)} />
          </div>
          <button onClick={() => remove(i)} className="p-2.5 text-red-400 hover:text-red-600 transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button onClick={add}
        className="flex items-center gap-1.5 text-sm text-[#22568F] hover:text-[#1a4070] font-medium mt-1">
        <Plus size={14} /> Add row
      </button>
    </div>
  );
}

// ── Liabilities dynamic rows ──────────────────────────────────────────
function LiabilityRows({ rows, onChange }) {
  const LOAN_TYPES = [
    { value: 'home', label: 'Home Loan' },
    { value: 'vehicle', label: 'Car Loan' },
    { value: 'education', label: 'Education Loan' },
    { value: 'personal', label: 'Personal Loan' },
    { value: 'other', label: 'Credit Card / Other' },
  ];
  function update(i, field, val) {
    onChange(rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  }
  function add() {
    onChange([...rows, { loan_type: 'home', label: '', outstanding_amount: 0, emi: 0, interest_rate: 0, remaining_months: 0, is_credit_card: false }]);
  }
  function remove(i) { onChange(rows.filter((_, idx) => idx !== i)); }

  return (
    <div className="space-y-4">
      {rows.map((row, i) => (
        <div key={i} className="border border-[#E2EBF5] rounded-lg p-4 relative">
          <button onClick={() => remove(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600">
            <Trash2 size={14} />
          </button>
          <div className="grid md:grid-cols-3 gap-3">
            <Field label="Loan Type">
              <select value={row.loan_type} onChange={e => update(i, 'loan_type', e.target.value)}
                className="w-full border border-[#D1DDE8] rounded-lg p-2.5 text-sm bg-white">
                {LOAN_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Label / Bank Name">
              <input type="text" value={row.label} placeholder="e.g. SBI Home Loan"
                onChange={e => update(i, 'label', e.target.value)}
                className="w-full border border-[#D1DDE8] rounded-lg p-2.5 text-sm" />
            </Field>
            <Field label="Outstanding Amount">
              <NumInput value={row.outstanding_amount} onChange={v => update(i, 'outstanding_amount', v)} />
            </Field>
            <Field label="Monthly EMI">
              <NumInput value={row.emi} onChange={v => update(i, 'emi', v)} />
            </Field>
            <Field label="Interest Rate (% p.a.)">
              <NumInput value={row.interest_rate} onChange={v => update(i, 'interest_rate', v)} prefix="" suffix="%" />
            </Field>
            <Field label="Remaining Months">
              <NumInput value={row.remaining_months} onChange={v => update(i, 'remaining_months', v)} prefix="" suffix=" mo" />
            </Field>
          </div>
        </div>
      ))}
      <button onClick={add}
        className="flex items-center gap-1.5 text-sm text-[#22568F] hover:text-[#1a4070] font-medium">
        <Plus size={14} /> Add liability
      </button>
    </div>
  );
}

// ── Insurance dynamic rows ────────────────────────────────────────────
function InsuranceRows({ rows, onChange }) {
  const TYPES = [
    { value: 'term', label: 'Term Insurance' },
    { value: 'life', label: 'Life Insurance' },
    { value: 'health', label: 'Health Insurance' },
    { value: 'vehicle', label: 'Vehicle Insurance' },
    { value: 'other', label: 'Other' },
  ];
  function update(i, field, val) {
    onChange(rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  }
  function add() { onChange([...rows, { policy_type: 'term', provider: '', cover_amount: 0, premium: 0 }]); }
  function remove(i) { onChange(rows.filter((_, idx) => idx !== i)); }

  return (
    <div className="space-y-4">
      {rows.map((row, i) => (
        <div key={i} className="border border-[#E2EBF5] rounded-lg p-4 relative">
          <button onClick={() => remove(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600">
            <Trash2 size={14} />
          </button>
          <div className="grid md:grid-cols-4 gap-3">
            <Field label="Policy Type">
              <select value={row.policy_type} onChange={e => update(i, 'policy_type', e.target.value)}
                className="w-full border border-[#D1DDE8] rounded-lg p-2.5 text-sm bg-white">
                {TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Provider">
              <input type="text" value={row.provider} placeholder="LIC / HDFC Life..."
                onChange={e => update(i, 'provider', e.target.value)}
                className="w-full border border-[#D1DDE8] rounded-lg p-2.5 text-sm" />
            </Field>
            <Field label="Cover Amount">
              <NumInput value={row.cover_amount} onChange={v => update(i, 'cover_amount', v)} />
            </Field>
            <Field label="Annual Premium">
              <NumInput value={row.premium} onChange={v => update(i, 'premium', v)} />
            </Field>
          </div>
        </div>
      ))}
      <button onClick={add}
        className="flex items-center gap-1.5 text-sm text-[#22568F] hover:text-[#1a4070] font-medium">
        <Plus size={14} /> Add policy
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────
export default function FinancialProfile() {
  const { user, apiFetch } = useAuth();
  const { profile: savedProfile, saveProfile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => createEmptyProfile());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [exportError, setExportError] = useState(null); // { type, code }

  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
  useEffect(() => { if (savedProfile) setProfile(savedProfile); }, [savedProfile]);

  if (!user) return null;

  const totals = calculateTotals(profile);

  function setPersonal(field, val) {
    setProfile(p => ({ ...p, personal: { ...p.personal, [field]: val } }));
  }
  function setIncome(field, val) {
    setProfile(p => ({ ...p, income: { ...p.income, [field]: val } }));
  }
  function setExpense(field, val) {
    setProfile(p => ({ ...p, expenses: { ...p.expenses, [field]: val } }));
  }
  function setCalcInput(field, val) {
    setProfile(p => ({ ...p, calculatorInputs: { ...p.calculatorInputs, [field]: val } }));
  }

  // Email + phone validation
  function validate() {
    const e = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^[6-9]\d{9}$/;
    if (profile.personal.email && !emailRe.test(profile.personal.email)) e.email = 'Enter a valid email address';
    if (profile.personal.phone && !phoneRe.test(profile.personal.phone)) e.phone = 'Enter a valid 10-digit Indian mobile number';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    await saveProfile(profile);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  }

  async function handleDeleteAccount() {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    await apiFetch('/api/profile/me', { method: 'DELETE' });
    navigate('/');
  }

  async function handleExport(type) {
    setExportError(null);
    try {
      const res = await apiFetch(`/api/exports/${type}`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setExportError({ type, code: body.code || (type === 'pdf' ? 'PDF_ERROR' : 'XLSX_ERROR') });
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `radds_financial_profile_${Date.now()}.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setExportError({ type, code: 'NETWORK' });
    }
  }

  // Financial asset type options
  const FINANCIAL_ASSET_TYPES = [
    { value: 'bank', label: 'Bank Balance' },
    { value: 'mf', label: 'Mutual Funds' },
    { value: 'stocks', label: 'Equity / ETFs' },
    { value: 'bonds', label: 'Bonds / SGBs' },
    { value: 'insurance_cv', label: 'Insurance (Cash Value)' },
    { value: 'ppf', label: 'PPF / EPF / NPS' },
    { value: 'fd', label: 'Fixed Deposit' },
    { value: 'other', label: 'Other Financial' },
  ];
  const PHYSICAL_ASSET_TYPES = [
    { value: 'real_estate', label: 'Property' },
    { value: 'gold', label: 'Gold / Jewellery' },
    { value: 'other', label: 'Vehicles / Other' },
  ];

  const ci = profile.calculatorInputs;

  return (
    <main className="py-20 pt-24 bg-[#F4F8FC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-[#6B7E99] hover:text-[#22568F] mb-4">
          ← Back
        </button>

        <h1 className="font-playfair text-4xl font-bold mb-2 text-[#0D1B2E]">Financial Profile</h1>
        <p className="text-[#6B7E99] mb-2">Your data is used to generate personalised financial reports and calculator defaults.</p>

        {/* Fetching banner — shown only while data is loading from server */}
        {profileLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800 flex items-center gap-3 mb-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 flex-shrink-0" />
            <span>Fetching your saved data…</span>
          </div>
        )}

        {/* Save note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 flex items-start gap-2 mb-6">
          <span>ℹ️</span>
          <span>Changes are only saved when you click <strong>Save Profile</strong> at the bottom.</span>
        </div>

        {/* Summary card */}
        <div className="bg-white rounded-xl border border-[#E2EBF5] p-5 mb-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Monthly Income', val: totals.totalIncome, color: 'text-[#22568F]' },
              { label: 'Monthly Expenses', val: totals.totalExpenses, color: 'text-[#E85D3A]' },
              { label: 'Investment Capacity', val: totals.investmentCapacity, color: 'text-green-600' },
              { label: totals.deficit > 0 ? 'Monthly Deficit' : 'Child Expenses', val: totals.deficit > 0 ? totals.deficit : totals.childExpenses, color: totals.deficit > 0 ? 'text-red-500' : 'text-[#6B7E99]' },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <p className="text-xs text-[#6B7E99] mb-0.5">{label}</p>
                <p className={`text-xl font-bold ${color}`}>₹{val.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 1. Personal Details ── */}
        <Section title="1. Personal Details" defaultOpen={true}>
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            <Field label="Full Name">
              <input type="text" value={profile.personal.name} placeholder="Your name"
                onChange={e => setPersonal('name', e.target.value)}
                className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm" />
            </Field>
            <Field label="Email">
              <input type="email" value={profile.personal.email} placeholder="Email address"
                onChange={e => setPersonal('email', e.target.value)}
                className={`w-full border rounded-lg p-3 text-sm ${errors.email ? 'border-red-400' : 'border-[#D1DDE8]'}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </Field>
            <Field label="Phone">
              <input type="tel" value={profile.personal.phone} placeholder="10-digit mobile"
                onChange={e => setPersonal('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className={`w-full border rounded-lg p-3 text-sm ${errors.phone ? 'border-red-400' : 'border-[#D1DDE8]'}`} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </Field>
            <Field label="Age">
              <input type="number" min="18" max="100" value={profile.personal.age} placeholder="Your age"
                onChange={e => setPersonal('age', e.target.value)}
                className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm" />
            </Field>
            <Field label="Risk Preference">
              <select value={profile.personal.riskPreference} onChange={e => setPersonal('riskPreference', e.target.value)}
                className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm bg-white">
                <option value="">Select...</option>
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </Field>
            <Field label="Date of Plan">
              <input type="date" value={profile.personal.dateOfPlan}
                onChange={e => setPersonal('dateOfPlan', e.target.value)}
                className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm" />
            </Field>
            <Field label="Number of Children">
              <select value={profile.personal.children}
                onChange={e => {
                  const count = Number(e.target.value);
                  setProfile(prev => ({
                    ...prev,
                    personal: { ...prev.personal, children: count },
                    children: Array.from({ length: count }, (_, idx) =>
                      prev.children?.[idx] || { name: '', age: '', education: 0, allowance: 0, holiday: 0, medical: 0 }),
                  }));
                }}
                className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm bg-white">
                {[0,1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        {/* ── 2. Monthly Income ── */}
        <Section title="2. Monthly Income">
          <div className="grid md:grid-cols-3 gap-4 mt-2">
            <Field label="Salary (Primary)">
              <NumInput value={profile.income.salary} onChange={v => setIncome('salary', v)} />
            </Field>
            <Field label="Spouse / Second Salary">
              <NumInput value={profile.income.salary2} onChange={v => setIncome('salary2', v)} />
            </Field>
            <Field label="Other Income">
              <NumInput value={profile.income.otherIncome} onChange={v => setIncome('otherIncome', v)} />
            </Field>
          </div>
        </Section>

        {/* ── 3. Monthly Expenses ── */}
        <Section title="3. Monthly Expenses">
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            {[
              { key: 'householdExp', label: 'House Hold Expenses' },
              { key: 'rent', label: 'Rent' },
              { key: 'emi', label: 'EMI (Existing Loans)' },
              { key: 'healthInsurance', label: 'Health Insurance (Annual ÷ 12)' },
              { key: 'insurance', label: 'Insurance Premium (Annual ÷ 12)' },
              { key: 'bills', label: 'Bills (Utilities / Mobile)' },
              { key: 'schoolFees', label: 'School Fees (Annual ÷ 12)' },
              { key: 'fuel', label: 'Fuel' },
              { key: 'personal', label: 'Personal / Miscellaneous' },
              { key: 'existingSip', label: 'Existing SIP (Monthly)' },
              { key: 'addExpenses', label: 'Additional Expenses' },
            ].map(({ key, label }) => (
              <Field key={key} label={label}>
                <NumInput value={profile.expenses[key]} onChange={v => setExpense(key, v)} />
              </Field>
            ))}
          </div>
        </Section>

        {/* ── 4. Children Expenses ── */}
        {profile.personal.children > 0 && (
          <Section title="4. Children Expenses">
            <div className="space-y-6 mt-2">
              {profile.children.map((child, i) => (
                <div key={i} className="border border-[#E2EBF5] rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <Field label={`Child ${i + 1} Name`}>
                      <input type="text" value={child.name} placeholder="Name"
                        onChange={e => setProfile(p => ({ ...p, children: p.children.map((c, idx) => idx === i ? { ...c, name: e.target.value } : c) }))}
                        className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm" />
                    </Field>
                    <Field label="Age">
                      <input type="number" min="0" max="25" value={child.age} placeholder="Age"
                        onChange={e => setProfile(p => ({ ...p, children: p.children.map((c, idx) => idx === i ? { ...c, age: Number(e.target.value) } : c) }))}
                        className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm" />
                    </Field>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { key: 'education', label: 'Education (Monthly)' },
                      { key: 'allowance', label: 'Allowance (Monthly)' },
                      { key: 'holiday', label: 'Holiday (Monthly)' },
                      { key: 'medical', label: 'Medical (Monthly)' },
                    ].map(({ key, label }) => (
                      <Field key={key} label={label}>
                        <NumInput value={child[key]}
                          onChange={v => setProfile(p => ({ ...p, children: p.children.map((c, idx) => idx === i ? { ...c, [key]: v } : c) }))} />
                      </Field>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── 5. Net Worth — Financial Assets ── */}
        <Section title="5. Net Worth — Financial Assets">
          <p className="text-xs text-[#6B7E99] mb-3 mt-1">Bank balances, mutual funds, equity, bonds, PPF/EPF/NPS, etc.</p>
          <DynamicRows
            rows={profile.financialAssets}
            onChange={rows => setProfile(p => ({ ...p, financialAssets: rows }))}
            typeOptions={FINANCIAL_ASSET_TYPES}
            labelPlaceholder="e.g. HDFC Bank, ICICI MF"
          />
        </Section>

        {/* ── 6. Net Worth — Physical Assets ── */}
        <Section title="6. Net Worth — Physical Assets">
          <p className="text-xs text-[#6B7E99] mb-3 mt-1">Property, gold, vehicles, other tangible assets.</p>
          <DynamicRows
            rows={profile.physicalAssets}
            onChange={rows => setProfile(p => ({ ...p, physicalAssets: rows }))}
            typeOptions={PHYSICAL_ASSET_TYPES}
            labelPlaceholder="e.g. Flat in Mumbai, Gold ETF"
          />
        </Section>

        {/* ── 7. Liabilities ── */}
        <Section title="7. Liabilities">
          <div className="mt-2">
            <LiabilityRows
              rows={profile.liabilities}
              onChange={rows => setProfile(p => ({ ...p, liabilities: rows }))}
            />
          </div>
        </Section>

        {/* ── 8. Insurance ── */}
        <Section title="8. Insurance Policies">
          <div className="mt-2">
            <InsuranceRows
              rows={profile.insurance}
              onChange={rows => setProfile(p => ({ ...p, insurance: rows }))}
            />
          </div>
        </Section>

        {/* ── 9. Investment Planning Inputs ── */}
        <Section title="9. Investment Planning">
          <p className="text-xs text-[#6B7E99] mb-3 mt-1">Used to generate the Investment Planning and SWP sheets.</p>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="SIP Amount (Monthly)"><NumInput value={ci.sipAmount} onChange={v => setCalcInput('sipAmount', v)} /></Field>
            <Field label="SIP Growth Rate (% p.a.)"><NumInput value={ci.sipGrowthRate} onChange={v => setCalcInput('sipGrowthRate', v)} prefix="" suffix="%" /></Field>
            <Field label="SIP Start Age"><NumInput value={ci.sipStartAge} onChange={v => setCalcInput('sipStartAge', v)} prefix="" suffix=" yrs" /></Field>
            <Field label="One-Time Investment"><NumInput value={ci.oneTimeInvest} onChange={v => setCalcInput('oneTimeInvest', v)} /></Field>
            <Field label="SWP Monthly Withdrawal"><NumInput value={ci.swpWithdrawal} onChange={v => setCalcInput('swpWithdrawal', v)} /></Field>
            <Field label="SWP Corpus"><NumInput value={ci.swpCorpus} onChange={v => setCalcInput('swpCorpus', v)} /></Field>
          </div>
        </Section>

        {/* ── 10. Home Loan ── */}
        <Section title="10. Home Loan (Interest-Free Planning)">
          <p className="text-xs text-[#6B7E99] mb-3 mt-1">Used to generate the Home Loan Interest Free sheet.</p>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Loan Amount"><NumInput value={ci.homeLoanAmount} onChange={v => setCalcInput('homeLoanAmount', v)} /></Field>
            <Field label="Monthly EMI"><NumInput value={ci.homeLoanEmi} onChange={v => setCalcInput('homeLoanEmi', v)} /></Field>
            <Field label="Tenure (Years)"><NumInput value={ci.homeLoanTenure} onChange={v => setCalcInput('homeLoanTenure', v)} prefix="" suffix=" yrs" /></Field>
            <Field label="Interest Rate (% p.a.)"><NumInput value={ci.homeLoanRate} onChange={v => setCalcInput('homeLoanRate', v)} prefix="" suffix="%" /></Field>
          </div>
        </Section>

        {/* ── 11. Term Insurance ── */}
        <Section title="11. Term Insurance Planning">
          <p className="text-xs text-[#6B7E99] mb-3 mt-1">Used to generate the Term Insurance sheet.</p>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Annual Premium"><NumInput value={ci.termInsurancePremium} onChange={v => setCalcInput('termInsurancePremium', v)} /></Field>
            <Field label="SIP Amount (Monthly)"><NumInput value={ci.termInsuranceSip} onChange={v => setCalcInput('termInsuranceSip', v)} /></Field>
            <Field label="Tenure (Years)"><NumInput value={ci.termInsuranceTenure} onChange={v => setCalcInput('termInsuranceTenure', v)} prefix="" suffix=" yrs" /></Field>
            <Field label="Growth Rate (% p.a.)"><NumInput value={ci.termGrowthRate} onChange={v => setCalcInput('termGrowthRate', v)} prefix="" suffix="%" /></Field>
          </div>
        </Section>

        {/* Radds philosophy */}
        <div className="bg-[#EAF2FF] rounded-xl border border-[#C8DCF5] p-5 mt-6 text-sm">
          <p className="font-semibold text-[#22568F] mb-1">The Radds Perspective</p>
          <p className="text-[#3D4F66]">Most people think: <strong>Income − Expenses = Savings</strong></p>
          <p className="text-[#3D4F66] mt-1">We encourage: <strong>Income − Investments = Lifestyle Spending</strong></p>
        </div>

        {/* Action buttons */}
        <div className="mt-6 space-y-4">
          {/* Export error — shown inline, dismissable, with retry */}
          {exportError && (
            <ErrorPage
              code={exportError.code}
              inline
              onRetry={() => handleExport(exportError.type)}
            />
          )}
          <div className="flex flex-wrap gap-3 items-center">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Profile'}
            </Button>
            <button onClick={() => handleExport('xlsx')}
              className="px-5 py-3 rounded-lg border border-[#22568F] text-[#22568F] text-sm font-medium hover:bg-[#22568F] hover:text-white transition-all">
              Export Excel (5 Sheets)
            </button>
            <button onClick={() => handleExport('pdf')}
              className="px-5 py-3 rounded-lg border border-[#22568F] text-[#22568F] text-sm font-medium hover:bg-[#22568F] hover:text-white transition-all">
              Export PDF
            </button>
          </div>

          {/* DPDP — Delete Account */}
          <div className="border-t border-[#E2EBF5] pt-5 mt-4">
            <p className="text-sm text-[#6B7E99] mb-3">Under the Digital Personal Data Protection Act, you have the right to request erasure of all your data.</p>
            {!deleteConfirm ? (
              <button onClick={() => setDeleteConfirm(true)}
                className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-4 py-2 rounded-lg">
                Delete My Account & All Data
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700 font-medium mb-3">⚠️ This will permanently delete your account and all associated data. This cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                    Yes, Delete Everything
                  </button>
                  <button onClick={() => setDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-[#9BADC0] mt-8 mb-4">Mutual Fund investments are subject to market risks. This profile is for planning purposes only and does not constitute investment advice. Radds Capital is an AMFI-Registered Mutual Fund Distributor.</p>
      </div>
    </main>
  );
}
