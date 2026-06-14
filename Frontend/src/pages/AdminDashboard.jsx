import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, apiFetch } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect non-admins
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    // Admin check happens server-side — if API returns 403, redirect
  }, [user]);

  useEffect(() => {
    if (tab === 'bookings') loadBookings();
    if (tab === 'users') loadUsers();
  }, [tab]);

  async function loadBookings() {
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/bookings');
      if (res.status === 403) { navigate('/'); return; }
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } finally { setLoading(false); }
  }

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/users');
      if (res.status === 403) { navigate('/'); return; }
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } finally { setLoading(false); }
  }

  async function loadUserProfile(id) {
    const res = await apiFetch(`/api/admin/users/${id}`);
    const data = await res.json();
    setSelectedUser(data);
  }

  const tabs = [
    { key: 'bookings', label: 'Bookings' },
    { key: 'users', label: 'Users & Profiles' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#22568f] text-white mt-16 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold">Radds Capital — Admin</h1>
            <p className="text-xs opacity-70">Internal dashboard</p>
          </div>
        </div>
        <span className="text-sm opacity-70">{user?.email}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key ? 'border-[#22568f] text-[#22568f]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-12 text-gray-400">Loading...</div>}

        {/* Bookings Tab */}
        {tab === 'bookings' && !loading && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Consultation Bookings ({bookings.length})</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {['Name', 'Email', 'Phone', 'Date & Time', 'Purpose', 'Status'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{b.name}</td>
                      <td className="px-4 py-3 text-gray-600">{b.email}</td>
                      <td className="px-4 py-3 text-gray-600">{b.phone}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(b.scheduled_start_at).toLocaleString('en-IN', {
                          dateStyle: 'medium', timeStyle: 'short'
                        })}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{b.purpose || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                  {!bookings.length && (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-400">No bookings yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && !loading && (
          <div className="grid lg:grid-cols-[300px_1fr] gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Users ({users.length})</h2>
              <div className="space-y-2">
                {users.map(u => (
                  <button key={u.id} onClick={() => loadUserProfile(u.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                      selectedUser?._raw?.user?.email === u.email
                        ? 'border-[#22568f] bg-[#f4f8fc]' : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}>
                    <p className="font-medium text-sm">{u.display_name || 'No name'}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Joined {new Date(u.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              {selectedUser ? (
                <UserProfileView data={selectedUser} />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  Select a user to view their financial profile
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UserProfileView({ data }) {
  const user       = data.user || {};
  const profile    = data.profile || {};
  const income     = data.income || [];
  const expenses   = data.expenses || [];
  const children   = data.children || [];
  const childExp   = data.child_expenses || [];
  const liabilities  = data.liabilities || [];
  const investments  = data.investments || [];
  const insurance    = data.insurance || [];
  const goals        = data.goals || [];

  const totalIncome   = income.reduce((s, r) => s + Number(r.amount || 0), 0);
  const totalExpenses = expenses.reduce((s, r) => s + Number(r.amount || 0), 0);
  const financialAssets = investments.filter(i => !i.asset_class || i.asset_class === 'financial');
  const physicalAssets  = investments.filter(i => i.asset_class === 'physical');
  const totalLiab       = liabilities.reduce((s, l) => s + Number(l.outstanding_amount || 0), 0);
  const totalFinancial  = financialAssets.reduce((s, i) => s + Number(i.current_value || 0), 0);
  const totalPhysical   = physicalAssets.reduce((s, i) => s + Number(i.current_value || 0), 0);
  const netWorth        = totalFinancial + totalPhysical - totalLiab;

  function inr(n) {
    return '₹' + Number(n || 0).toLocaleString('en-IN');
  }

  function Section({ title, children: c }) {
    return (
      <div>
        <h4 className="font-semibold text-[#22568f] text-sm uppercase tracking-wide mb-2 pb-1 border-b border-[#e2ebf5]">
          {title}
        </h4>
        {c}
      </div>
    );
  }

  function Row({ label, value, sub }) {
    return (
      <div className="flex justify-between items-start text-sm py-1.5 border-b border-gray-50">
        <span className="text-gray-600">{label}{sub && <span className="text-xs text-gray-400 ml-1">{sub}</span>}</span>
        <span className="font-medium text-gray-800 text-right">{value || '—'}</span>
      </div>
    );
  }

  const riskLabel = { conservative: 'Conservative', moderate: 'Moderate', aggressive: 'Aggressive' };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 overflow-y-auto max-h-[80vh]">

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Monthly Income',      value: inr(totalIncome),                         color: 'text-green-600' },
          { label: 'Monthly Expenses',    value: inr(totalExpenses),                       color: 'text-red-500' },
          { label: 'Investment Capacity', value: inr(Math.max(0, totalIncome - totalExpenses)), color: 'text-[#22568f]' },
        ].map(card => (
          <div key={card.label} className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Personal Details */}
      <Section title="Personal Details">
        <Row label="Name"           value={user.display_name} />
        <Row label="Email"          value={user.email} />
        <Row label="Phone"          value={user.phone} />
        <Row label="Age"            value={profile.age ? `${profile.age} years` : null} />
        <Row label="Risk Preference" value={riskLabel[profile.risk_preference]} />
        <Row label="Date of Plan"   value={profile.date_of_plan
          ? new Date(profile.date_of_plan).toLocaleDateString('en-IN') : null} />
      </Section>

      {/* Income */}
      {income.length > 0 && (
        <Section title="Monthly Income">
          {income.map(r => <Row key={r.id} label={r.label} value={`${inr(r.amount)}/mo`} />)}
          <Row label="Total" value={`${inr(totalIncome)}/mo`} />
        </Section>
      )}

      {/* Expenses */}
      {expenses.length > 0 && (
        <Section title="Monthly Expenses">
          {expenses.map(r => <Row key={r.id} label={r.label} value={`${inr(r.amount)}/mo`} />)}
          <Row label="Total" value={`${inr(totalExpenses)}/mo`} />
        </Section>
      )}

      {/* Children */}
      {children.length > 0 && (
        <Section title="Children">
          {children.map(child => {
            const exp = childExp.find(e => e.child_id === child.id) || {};
            const childTotal = Number(exp.education||0) + Number(exp.allowance||0) + Number(exp.holiday||0) + Number(exp.medical||0);
            return (
              <div key={child.id} className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">{child.name} (Age {child.age})</p>
                <Row label="Education"  value={inr(exp.education)} />
                <Row label="Allowance"  value={inr(exp.allowance)} />
                <Row label="Holiday"    value={inr(exp.holiday)} />
                <Row label="Medical"    value={inr(exp.medical)} />
                <Row label="Total/mo"   value={inr(childTotal)} />
              </div>
            );
          })}
        </Section>
      )}

      {/* Financial Assets */}
      {financialAssets.length > 0 && (
        <Section title="Financial Assets">
          {financialAssets.map(r => <Row key={r.id} label={r.label} value={inr(r.current_value)} />)}
          <Row label="Total" value={inr(totalFinancial)} />
        </Section>
      )}

      {/* Physical Assets */}
      {physicalAssets.length > 0 && (
        <Section title="Physical Assets">
          {physicalAssets.map(r => <Row key={r.id} label={r.label} value={inr(r.current_value)} />)}
          <Row label="Total" value={inr(totalPhysical)} />
        </Section>
      )}

      {/* Liabilities */}
      {liabilities.length > 0 && (
        <Section title="Liabilities">
          {liabilities.map(r => (
            <Row key={r.id} label={r.label}
              value={`EMI ${inr(r.emi)}/mo | Outstanding ${inr(r.outstanding_amount)}`} />
          ))}
          <Row label="Total Outstanding" value={inr(totalLiab)} />
        </Section>
      )}

      {/* Net Worth */}
      {(investments.length > 0 || liabilities.length > 0) && (
        <Section title="Net Worth">
          <Row label="Total Assets"      value={inr(totalFinancial + totalPhysical)} />
          <Row label="Total Liabilities" value={inr(totalLiab)} />
          <Row label="Net Worth"
            value={<span className={netWorth >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
              {inr(netWorth)}
            </span>} />
        </Section>
      )}

      {/* Insurance */}
      {insurance.length > 0 && (
        <Section title="Insurance Policies">
          {insurance.map(r => (
            <Row key={r.id} label={`${r.policy_type.charAt(0).toUpperCase() + r.policy_type.slice(1)} — ${r.provider || 'N/A'}`}
              value={`Cover ${inr(r.cover_amount)} | Premium ${inr(r.premium)}/yr`} />
          ))}
        </Section>
      )}

      {/* Calculator Inputs */}
      {profile.sip_amount > 0 && (
        <Section title="Investment Planning Inputs">
          <Row label="SIP Amount"       value={`${inr(profile.sip_amount)}/mo`} />
          <Row label="SIP Growth Rate"  value={`${((profile.sip_growth_rate || 0.12) * 100).toFixed(0)}% p.a.`} />
          <Row label="SIP Start Age"    value={profile.sip_start_age} />
          {profile.one_time_invest > 0 && <Row label="One-Time Investment" value={inr(profile.one_time_invest)} />}
          {profile.swp_corpus > 0 && <>
            <Row label="SWP Corpus"     value={inr(profile.swp_corpus)} />
            <Row label="SWP Withdrawal" value={`${inr(profile.swp_withdrawal)}/mo`} />
          </>}
        </Section>
      )}

      {profile.home_loan_amount > 0 && (
        <Section title="Home Loan">
          <Row label="Loan Amount"    value={inr(profile.home_loan_amount)} />
          <Row label="EMI"            value={`${inr(profile.home_loan_emi)}/mo`} />
          <Row label="Tenure"         value={`${profile.home_loan_tenure} years`} />
          <Row label="Interest Rate"  value={`${((profile.home_loan_rate || 0.071) * 100).toFixed(2)}% p.a.`} />
        </Section>
      )}

      {profile.term_insurance_premium > 0 && (
        <Section title="Term Insurance">
          <Row label="Annual Premium"  value={inr(profile.term_insurance_premium)} />
          <Row label="SIP to Offset"   value={`${inr(profile.term_insurance_sip)}/mo`} />
          <Row label="Tenure"          value={`${profile.term_insurance_tenure} years`} />
        </Section>
      )}

      {/* Goals */}
      {goals.length > 0 && (
        <Section title="Financial Goals">
          {goals.map(r => (
            <Row key={r.id} label={r.goal_name}
              value={`${inr(r.target_amount)} by ${r.target_year}`}
              sub={r.priority ? `(${r.priority})` : ''} />
          ))}
        </Section>
      )}

    </div>
  );
}
