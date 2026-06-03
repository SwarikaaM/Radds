import { Link } from "react-router-dom";

import {
  getProfile,
  calculateTotals,
} from "../../utils/financialProfile";

export default function CalculatorProfileSummary() {
  const profile = getProfile();

  const hasProfile =
    profile?.personal?.name ||
    profile?.personal?.email ||
    profile?.personal?.phone;

  if (!hasProfile) {
    return null;
  }

  const totals =
    calculateTotals(profile);

  return (
    <div className="mb-6 rounded-xl border border-[#D7E7F7] bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">
          Financial Profile
        </h3>

        <Link
          to="/financial-profile"
          className="text-sm font-medium text-[#22568F] hover:underline"
        >
          Edit Profile
        </Link>
      </div>

      <div className="mt-4 grid sm:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-[#6B7E99]">
            Monthly Income
          </p>

          <p className="font-bold text-lg">
            ₹
            {totals.totalIncome.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#6B7E99]">
            Monthly Expenses
          </p>

          <p className="font-bold text-lg">
            ₹
            {totals.totalExpenses.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#6B7E99]">
            Investment Capacity
          </p>

          <p className="font-bold text-lg text-success">
            ₹
            {totals.investmentCapacity.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}