import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';

export default function SessionExpiredModal() {
  const { sessionExpired, reauth } = useProfile();
  const navigate = useNavigate();
  if (!sessionExpired) return null;

  function handleReauth() {
    reauth();
    navigate('/login', { state: { from: { pathname: '/financial-profile' } } });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Session Expired</h2>
        <p className="text-gray-500 text-sm mb-6">
          Your financial profile session has expired after 15 minutes for your security.
          Please sign in again to continue.
        </p>
        <button
          onClick={handleReauth}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700"
        >
          Sign In Again
        </button>
      </div>
    </div>
  );
}