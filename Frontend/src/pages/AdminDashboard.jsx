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
      setBookings(data);
    } finally { setLoading(false); }
  }

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/users');
      if (res.status === 403) { navigate('/'); return; }
      const data = await res.json();
      setUsers(data);
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
      <div className="bg-[#22568f] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Radds Capital — Admin</h1>
          <p className="text-xs opacity-70">Internal dashboard</p>
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
  const income = data.income || [];
  const expenses = data.expenses || [];
  const goals = data.goals || [];
  const liabilities = data.liabilities || [];
  const investments = data.investments || [];

  const totalIncome = income.reduce((s, r) => s + Number(r.amount), 0);
  const totalExpenses = expenses.reduce((s, r) => s + Number(r.amount), 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-3">Profile Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Monthly Income', value: `₹${totalIncome.toLocaleString('en-IN')}`, color: 'text-green-600' },
            { label: 'Monthly Expenses', value: `₹${totalExpenses.toLocaleString('en-IN')}`, color: 'text-red-500' },
            { label: 'Investment Capacity', value: `₹${Math.max(0, totalIncome - totalExpenses).toLocaleString('en-IN')}`, color: 'text-[#22568f]' },
          ].map(card => (
            <div key={card.label} className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      {income.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Income Sources</h4>
          {income.map(r => (
            <div key={r.id} className="flex justify-between text-sm py-1 border-b border-gray-100">
              <span>{r.label}</span><span className="font-medium">₹{Number(r.amount).toLocaleString('en-IN')}/mo</span>
            </div>
          ))}
        </div>
      )}

      {goals.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Financial Goals</h4>
          {goals.map(r => (
            <div key={r.id} className="flex justify-between text-sm py-1 border-b border-gray-100">
              <span>{r.goal_name}</span>
              <span className="font-medium">₹{Number(r.target_amount).toLocaleString('en-IN')} by {r.target_year}</span>
            </div>
          ))}
        </div>
      )}

      {liabilities.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Liabilities</h4>
          {liabilities.map(r => (
            <div key={r.id} className="flex justify-between text-sm py-1 border-b border-gray-100">
              <span>{r.label}</span><span className="font-medium">EMI ₹{Number(r.emi).toLocaleString('en-IN')}/mo</span>
            </div>
          ))}
        </div>
      )}

      {investments.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Existing Investments</h4>
          {investments.map(r => (
            <div key={r.id} className="flex justify-between text-sm py-1 border-b border-gray-100">
              <span>{r.label}</span><span className="font-medium">₹{Number(r.current_value).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}