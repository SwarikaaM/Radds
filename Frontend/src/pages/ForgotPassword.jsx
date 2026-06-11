import { useState } from 'react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | sent | error
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setStatus('sent');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Link to="/login" className="text-sm text-blue-600 hover:underline mb-4 block">← Back to Sign In</Link>
        <h1 className="text-2xl font-semibold mb-2 text-gray-800">Reset Password</h1>
        <p className="text-sm text-gray-500 mb-6">Enter your email and we'll send a reset link.</p>

        {status === 'sent' ? (
          <div className="bg-green-50 border border-green-200 rounded p-4 text-green-700 text-sm">
            If that email is registered, a reset link has been sent. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit" disabled={status === 'loading'}
              className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}