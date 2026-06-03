import { Link } from "react-router-dom";

import { getInvestmentCapacity } from "../../utils/calculatorDefaults";

export default function ProfileCapacityBanner() {
  const investmentCapacity = getInvestmentCapacity();

  if (
    !Number.isFinite(investmentCapacity) ||
    investmentCapacity <= 0
  ) {
    return null;
  }

  return (
    <div className="mb-6 rounded-xl border border-[#D7E7F7] bg-[#F4F8FC] p-4">
      <p className="text-sm font-semibold text-[#22568F]">
        Using Your Financial Profile
      </p>

      <p className="mt-2 text-3xl font-bold text-[#22568F]">
        ₹{investmentCapacity.toLocaleString()}
        <span className="ml-1 text-base font-medium text-[#6B7E99]">
          / month
        </span>
      </p>

      <p className="mt-2 text-sm text-[#6B7E99]">
        This amount was calculated from your income and
        expenses and is being used as the default
        investment amount.
      </p>

      <Link
        to="/financial-profile"
        className="mt-3 inline-flex text-sm font-semibold text-[#22568F] hover:underline"
      >
        Edit Financial Profile →
      </Link>
    </div>
  );
}