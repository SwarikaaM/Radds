import { useState } from 'react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

export default function Signup() {
  const [form, setForm] = useState({ display_name: '', email: '', password: '', confirm: '' });
  const [consent, setConsent] = useState({ terms: false, privacy: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (!consent.terms || !consent.privacy) return setError('You must accept both Terms and Privacy Policy');
    if (form.password.length < 8) return setError('Password must be at least 8 characters');

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, display_name: form.display_name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0]?.msg || data.error || 'Registration failed');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-xl font-semibold text-green-600 mb-2">Check your email</h2>
        <p className="text-gray-600 text-sm">We've sent a verification link to <strong>{form.email}</strong>. Please verify before signing in.</p>
        <Link to="/login" className="mt-4 inline-block text-blue-600 hover:underline text-sm">Back to Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Create Account</h1>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[['display_name','Name','text'],['email','Email','email'],['password','Password','password'],['confirm','Confirm Password','password']].map(([key, label, type]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} required value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          {/* DPDP-compliant separate checkboxes */}
          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={consent.terms} onChange={e => setConsent(c => ({ ...c, terms: e.target.checked }))} className="mt-0.5" />
              <span>I agree to the <a href="/terms" target="_blank" className="text-blue-600 underline">Terms & Conditions</a></span>
            </label>
            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={consent.privacy} onChange={e => setConsent(c => ({ ...c, privacy: e.target.checked }))} className="mt-0.5" />
              <span>I agree to the <a href="/privacy" target="_blank" className="text-blue-600 underline">Privacy Policy</a></span>
            </label>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}