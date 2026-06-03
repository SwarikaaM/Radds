import {
  calculateTotals,
} from "../../utils/financialProfile";

export default function ProfileStatusCard({
  profile,
}) {
  const totals =
    calculateTotals(profile);

  const isComplete =
    profile.personal.name &&
    profile.personal.email &&
    profile.personal.phone;

  return (
    <section className="bg-white rounded-xl border p-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>
          <h2 className="font-semibold text-xl">
            Profile Status
          </h2>

          <p className="text-[#6B7E99] mt-1">
            Used across calculators.
          </p>
        </div>

        <div
          className={`
            px-4 py-2 rounded-full text-sm font-medium
            ${
              isComplete
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }
          `}
        >
          {isComplete
            ? "Active"
            : "Incomplete"}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-6">

        <div>
          <p className="text-xs text-[#6B7E99]">
            Monthly Income
          </p>

          <p className="font-bold text-xl">
            ₹
            {totals.totalIncome.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#6B7E99]">
            Monthly Expenses
          </p>

          <p className="font-bold text-xl">
            ₹
            {totals.totalExpenses.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#6B7E99]">
            Investment Capacity
          </p>

          <p className="font-bold text-xl text-success">
            ₹
            {totals.investmentCapacity.toLocaleString()}
          </p>
        </div>

      </div>
    </section>
  );
}