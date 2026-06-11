import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/useProfile';

export default function ProfileCapacityBanner() {
  const { user } = useAuth();
  const { totals, hasProfile, loading } = useProfile();

  // Not logged in — show nothing
  if (!user) return null;

  // Loading
  if (loading) return (
    <div className="mb-6 rounded-xl border border-[#D7E7F7] bg-[#F4F8FC] p-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  // Logged in but no profile yet
  if (!hasProfile) return (
    <div className="mb-6 rounded-xl border border-[#D7E7F7] bg-[#F4F8FC] p-4">
      <p className="text-sm font-semibold text-[#22568F]">Financial Profile Not Set Up</p>
      <p className="mt-1 text-sm text-[#6B7E99]">
        Create your financial profile to get personalised calculator defaults.
      </p>
      <Link
        to="/financial-profile"
        className="mt-3 inline-flex text-sm font-semibold text-[#22568F] hover:underline"
      >
        Create Financial Profile →
      </Link>
    </div>
  );

  const capacity = totals?.investmentCapacity || 0;

  // Has profile but zero investment capacity
  if (capacity <= 0) return (
    <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
      <p className="text-sm font-semibold text-orange-700">Investment Capacity: ₹0</p>
      <p className="mt-1 text-sm text-orange-600">
        Your expenses exceed your income. Review your financial profile.
      </p>
      <Link to="/financial-profile" className="mt-2 inline-flex text-sm font-semibold text-orange-700 hover:underline">
        Edit Profile →
      </Link>
    </div>
  );

  return (
    <div className="mb-6 rounded-xl border border-[#D7E7F7] bg-[#F4F8FC] p-4">
      <p className="text-sm font-semibold text-[#22568F]">Using Your Financial Profile</p>
      <p className="mt-2 text-3xl font-bold text-[#22568F]">
        ₹{capacity.toLocaleString('en-IN')}
        <span className="ml-1 text-base font-medium text-[#6B7E99]">/ month</span>
      </p>
      <p className="mt-2 text-sm text-[#6B7E99]">
        Calculated from your saved income and expenses. Used as the default investment amount.
      </p>
      <Link to="/financial-profile" className="mt-3 inline-flex text-sm font-semibold text-[#22568F] hover:underline">
        Edit Financial Profile →
      </Link>
    </div>
  );
}