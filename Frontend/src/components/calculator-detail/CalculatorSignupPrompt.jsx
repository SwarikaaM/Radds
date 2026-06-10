import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';

export default function CalculatorSignupPrompt() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasProfile } = useProfile();

  // Logged in and has profile
  if (user && hasProfile) {
    return (
      <section className="rounded-2xl border border-[#D7E7F7] bg-[#F4F8FC] p-8">
        <h3 className="text-2xl font-bold text-[#0F172A]">Financial Profile Active</h3>
        <p className="mt-3 text-[#6B7E99]">Your calculators are using your saved financial profile data.</p>
        <div className="mt-8">
          <Button onClick={() => navigate('/financial-profile')}>Edit Financial Profile</Button>
        </div>
      </section>
    );
  }

  // Logged in but no profile yet
  if (user && !hasProfile) {
    return (
      <section className="rounded-2xl border border-[#D7E7F7] bg-[#F4F8FC] p-8">
        <h3 className="text-2xl font-bold text-[#0F172A]">Create Your Financial Profile</h3>
        <p className="mt-3 text-[#6B7E99]">Complete your profile to get personalised calculator defaults.</p>
        <div className="mt-8">
          <Button onClick={() => navigate('/financial-profile')}>Create Financial Profile</Button>
        </div>
      </section>
    );
  }

  // Not logged in
  return (
    <section className="rounded-2xl border border-[#D7E7F7] bg-[#F4F8FC] p-8">
      <div className="max-w-2xl">
        <h3 className="text-2xl font-bold text-[#0F172A]">Create Your Financial Profile</h3>
        <p className="mt-3 text-[#6B7E99]">
          Get personalised planning based on your actual income, expenses and investment capacity.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {['Calculate investment capacity', 'Auto-fill calculators', 'Save financial details', 'Unlock future planning tools'].map(item => (
            <div key={item} className="flex items-center gap-3">
              <span className="text-green-600">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex gap-3">
          <Button onClick={() => navigate('/signup')}>Create Financial Profile</Button>
          <button onClick={() => navigate('/login')} className="text-sm text-[#22568F] hover:underline self-center">
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </section>
  );
}