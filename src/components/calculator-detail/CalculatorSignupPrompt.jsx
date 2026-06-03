import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";

import { getProfile } from "../../utils/financialProfile";

export default function CalculatorSignupPrompt() {
  const navigate = useNavigate();

  const profile = getProfile();

  const hasProfile =
    profile?.personal?.name ||
    profile?.personal?.email ||
    profile?.personal?.phone;

  if (hasProfile) {
    return (
      <section className="rounded-2xl border border-[#D7E7F7] bg-[#F4F8FC] p-8">
        <h3 className="text-2xl font-bold text-[#0F172A]">
          Financial Profile Active
        </h3>

        <p className="mt-3 text-[#6B7E99]">
          Your calculators are already using
          your financial profile data.
        </p>

        <div className="mt-8">
          <Button
            onClick={() =>
              navigate("/financial-profile")
            }
          >
            Edit Financial Profile
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#D7E7F7] bg-[#F4F8FC] p-8">
      <div className="max-w-2xl">
        <h3 className="text-2xl font-bold text-[#0F172A]">
          Create Your Financial Profile
        </h3>

        <p className="mt-3 text-[#6B7E99]">
          Get personalised planning based on your
          actual income, expenses and investment
          capacity.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <span className="text-green-600">✓</span>
            <span>Calculate investment capacity</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-green-600">✓</span>
            <span>Auto-fill calculators</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-green-600">✓</span>
            <span>Save financial details</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-green-600">✓</span>
            <span>Unlock future planning tools</span>
          </div>
        </div>

        <div className="mt-8">
          <Button
            onClick={() =>
              navigate("/financial-profile")
            }
          >
            Create Financial Profile
          </Button>
        </div>
      </div>
    </section>
  );
}