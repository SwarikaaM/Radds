import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; // see note below

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Supabase puts the token in the URL hash — the JS client picks it up automatically
  useEffect(() => {
    // supabase-js v2 auto-detects the recovery token from the hash
    // No manual action needed — the session is set by the client
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setStatus('loading');
    setError('');
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) { setError(err.message); setStatus('idle'); return; }
    setStatus('done');
    setTimeout(() => navigate('/login'), 2000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-2 text-gray-800">Set New Password</h1>
        {status === 'done' ? (
          <p className="text-green-600 text-sm">Password updated! Redirecting to login...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" required minLength={8} value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" required minLength={8} value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={status === 'loading'}
              className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50">
              {status === 'loading' ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}