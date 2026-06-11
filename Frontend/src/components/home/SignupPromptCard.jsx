import { motion } from 'framer-motion';
import { FileDown, Sparkles, CheckCircle2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/useProfile';

export default function SignupPromptCard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasProfile, totals } = useProfile();

  // Logged in + has profile — show capacity summary
  if (user && hasProfile) {
    return (
      <motion.div
        className="relative overflow-hidden rounded-card border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <CheckCircle2 size={14} className="text-green-600" />
              <span className="text-green-700 text-xs font-semibold uppercase tracking-wider">Profile Active</span>
            </div>
            <h4 className="text-textprimary font-semibold text-sm mb-1">
              Investment capacity: ₹{(totals?.investmentCapacity || 0).toLocaleString('en-IN')}/month
            </h4>
            <p className="text-textmuted text-xs">Your calculators are using your saved profile data.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/financial-profile')} className="flex-shrink-0">
            <User size={14} />
            Edit Profile
          </Button>
        </div>
      </motion.div>
    );
  }

  // Logged in but no profile yet
  if (user && !hasProfile) {
    return (
      <motion.div
        className="relative overflow-hidden rounded-card border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-5"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={14} className="text-accent" />
              <span className="text-accent text-xs font-semibold uppercase tracking-wider">One Step Away</span>
            </div>
            <h4 className="text-textprimary font-semibold text-sm mb-1">
              Create your financial profile to personalise these calculators
            </h4>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/financial-profile')} className="flex-shrink-0">
            <Sparkles size={14} />
            Create Profile
          </Button>
        </div>
      </motion.div>
    );
  }

  // Guest — show signup prompt (AMFI compliant — no "tax advice" or "financial planning" language)
  return (
    <motion.div
      className="relative overflow-hidden rounded-card border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-5"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-accent" />
            <span className="text-accent text-xs font-semibold uppercase tracking-wider">Personalise Your Calculators</span>
          </div>
          <h4 className="text-textprimary font-semibold text-sm mb-1">
            Get calculator defaults based on your actual income and expenses
          </h4>
          <div className="flex flex-wrap gap-3 mt-2">
            {['Auto-fill investment amount', 'Save your profile', 'Export PDF & Excel report'].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-textmuted text-xs">
                <CheckCircle2 size={11} className="text-success" />
                {item}
              </span>
            ))}
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate('/signup')} className="flex-shrink-0">
          <Sparkles size={14} />
          Create Profile
        </Button>
      </div>
    </motion.div>
  );
}