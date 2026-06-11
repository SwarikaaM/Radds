import { Link } from 'react-router-dom';
import { useProfile } from '../../context/useProfile';
import { useAuth } from '../../context/AuthContext';

export default function CalculatorProfileSummary() {
  const { user } = useAuth();
  const { profile, totals, hasProfile } = useProfile();

  // Not logged in — show nothing (CalculatorSignupPrompt handles CTA)
  if (!user) return null;

  // Logged in but no profile data yet
  if (!hasProfile) return null;

  return (
    <div className="mb-6 rounded-xl border border-[#D7E7F7] bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Financial Profile</h3>
        <Link to="/financial-profile" className="text-sm font-medium text-[#22568F] hover:underline">
          Edit Profile
        </Link>
      </div>
      <div className="mt-4 grid sm:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-[#6B7E99]">Monthly Income</p>
          <p className="font-bold text-lg">₹{totals?.totalIncome.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-[#6B7E99]">Monthly Expenses</p>
          <p className="font-bold text-lg">₹{totals?.totalExpenses.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-[#6B7E99]">Investment Capacity</p>
          <p className="font-bold text-lg text-green-600">₹{totals?.investmentCapacity.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}