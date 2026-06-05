import { useState, useEffect } from "react";

import Button from "../components/ui/Button";
import BackToCalculators from "../components/common/BackToCalculators";
import ProfileStatusCard from "../components/profile/ProfileStatusCard";
import ProfileSaveIndicator from "../components/profile/ProfileSaveIndicator";
import ExpenseBreakdownSection from "../components/profile/ExpenseBreakdownSection";
import ChildCard from "../components/profile/ChildCard";
import ChildrenSummary from "../components/profile/ChildrenSummary";

import {
  getProfile,
  saveProfile,
  calculateTotals,
} from "../utils/financialProfile";

export default function FinancialProfile() {
  const [profile, setProfile] =
    useState(getProfile());

  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const totals =
    calculateTotals(profile);

    const housingFields = [
    {
        key: "rent",
        label: "Rent / EMI",
    },
    {
        key: "maintenance",
        label: "Maintenance",
    },
    ];

    const utilityFields = [
    {
        key: "electricity",
        label: "Electricity",
    },
    {
        key: "water",
        label: "Water",
    },
    {
        key: "internet",
        label: "Internet",
    },
    ];

    const livingFields = [
    {
        key: "groceries",
        label: "Groceries",
    },
    ];

    const transportFields = [
    {
        key: "transport",
        label: "Transport",
    },
    {
        key: "fuel",
        label: "Fuel",
    },
    ];

    const medicalFields = [
    {
        key: "medical",
        label: "Medical",
    },
    ];

    const insuranceFields = [
    {
        key: "lifeInsurance",
        label: "Life Insurance",
    },
    {
        key: "healthInsurance",
        label: "Health Insurance",
    },
    {
        key: "vehicleInsurance",
        label: "Vehicle Insurance",
    },
    ];

    const lifestyleFields = [
    {
        key: "entertainment",
        label: "Entertainment",
    },
    {
        key: "travel",
        label: "Travel",
    },
    {
        key: "other",
        label: "Other Expenses",
    },
    ];

  const updateSection =
    (section, field, value) => {
      setProfile((prev) => ({
        ...prev,

        [section]: {
          ...prev[section],

          [field]:
            field === "name" ||
            field === "email" ||
            field === "phone"
              ? value
              : Number(value) || 0,
        },
      }));
    };

  const handleSave = () => {
    saveProfile(profile);

    setSaved(true);

    setTimeout(
      () => setSaved(false),
      4000
    );
  };

  return (
    <main className="py-20 pt-24 bg-[#F4F8FC] min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <BackToCalculators />
        <h1 className="font-playfair text-5xl font-bold mb-4">
          Financial Profile
        </h1>

        <p className="text-[#6B7E99] mb-12">
          Create your financial
          profile and automatically
          use your investment
          capacity across calculators.
        </p>

        <ProfileStatusCard
            profile={profile}
        />

        <ProfileSaveIndicator
            saved={saved}
        />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* PERSONAL */}
          <section className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-xl mb-5">
              Personal Details
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={
                  profile.personal.name
                }
                onChange={(e) =>
                  updateSection(
                    "personal",
                    "name",
                    e.target.value
                  )
                }
                className="w-full border rounded-lg p-3"
              />

              <input
                type="email"
                placeholder="Email"
                value={
                  profile.personal.email
                }
                onChange={(e) =>
                  updateSection(
                    "personal",
                    "email",
                    e.target.value
                  )
                }
                className="w-full border rounded-lg p-3"
              />

              <input
                type="tel"
                placeholder="Phone"
                value={
                  profile.personal.phone
                }
                onChange={(e) =>
                  updateSection(
                    "personal",
                    "phone",
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                className="w-full border rounded-lg p-3"
              />
            </div>
            <div className="mt-4">
                <label htmlFor="children-count" className="block mb-2 font-medium">
                    Number of Children
                </label>

                <select
                    id="children-count"
                    value={profile.personal.children}
                    onChange={(e) => {
                    const count = Number(
                        e.target.value
                    );

                    setProfile((prev) => ({
                        ...prev,

                        personal: {
                        ...prev.personal,
                        children: count,
                        },

                        children: Array.from(
                        { length: count },
                        (_, index) => {
                            return (
                            prev.children?.[
                                index
                            ] || {
                                name: "",
                                age: "",
                                education: 0,
                                allowance: 0,
                                holiday: 0,
                                medical: 0,
                            }
                            );
                        }
                        ),
                    }));
                    }}
                    className="w-full border rounded-lg p-3"
                >
                    {[0, 1, 2, 3, 4, 5].map(
                    (value) => (
                        <option
                        key={value}
                        value={value}
                        >
                        {value}
                        </option>
                    )
                    )}
                </select>
                </div>
          </section>

          {/* SUMMARY */}
          <section className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-xl mb-5">
              Financial Summary
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-[#6B7E99] text-sm">
                  Monthly Income
                </p>

                <p className="font-bold text-2xl">
                  ₹
                  {totals.totalIncome.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-[#6B7E99] text-sm">
                  Monthly Expenses
                </p>

                <p className="font-bold text-2xl">
                  ₹
                  {totals.totalExpenses.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-[#6B7E99] text-sm">
                    Child Expenses
                </p>

                <p className="font-bold text-2xl">
                    ₹
                    {totals.childExpenses.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-[#6B7E99] text-sm">
                  Investment Capacity
                </p>

                <p className="font-bold text-3xl text-success">
                  ₹
                  {totals.investmentCapacity.toLocaleString()}
                </p>
              </div>

              {totals.deficit > 0 && (
                <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
                    <p className="font-medium text-red-700">
                    Monthly Deficit Detected
                    </p>

                    <p className="text-sm text-red-600 mt-1">
                    Expenses exceed income by ₹
                    {totals.deficit.toLocaleString()}.
                    </p>
                </div>
                )}
            </div>
          </section>
        </div>

        {/* INCOME */}
        <section className="bg-white rounded-xl border p-6 mt-8">
          <h2 className="font-semibold text-xl mb-5">
            Monthly Income
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
                <label className="block mb-2 font-medium">
                Salary
                </label>

                <input
                type="number"
                min="0"
                placeholder="Monthly salary"
                value={profile.income.salary}
                onChange={(e) =>
                    updateSection(
                    "income",
                    "salary",
                    e.target.value
                    )
                }
                className="w-full border rounded-lg p-3"
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">
                Business Income
                </label>

                <input
                type="number"
                min="0"
                placeholder="Monthly business income"
                value={profile.income.businessIncome}
                onChange={(e) =>
                    updateSection(
                    "income",
                    "businessIncome",
                    e.target.value
                    )
                }
                className="w-full border rounded-lg p-3"
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">
                Rental Income
                </label>

                <input
                type="number"
                min="0"
                placeholder="Monthly rental income"
                value={profile.income.rentalIncome}
                onChange={(e) =>
                    updateSection(
                    "income",
                    "rentalIncome",
                    e.target.value
                    )
                }
                className="w-full border rounded-lg p-3"
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">
                Investment Income
                </label>

                <input
                type="number"
                min="0"
                placeholder="Monthly investment income"
                value={profile.income.investmentIncome}
                onChange={(e) =>
                    updateSection(
                    "income",
                    "investmentIncome",
                    e.target.value
                    )
                }
                className="w-full border rounded-lg p-3"
                />
            </div>
            </div>
        </section>

        {/* EXPENSES */}
        <ExpenseBreakdownSection
            title="Housing"
            fields={housingFields}
            values={profile.expenses}
            onChange={(key, value) =>
                updateSection(
                "expenses",
                key,
                value
                )
            }
            />

            <ExpenseBreakdownSection
            title="Utilities"
            fields={utilityFields}
            values={profile.expenses}
            onChange={(key, value) =>
                updateSection(
                "expenses",
                key,
                value
                )
            }
            />

            <ExpenseBreakdownSection
            title="Living Expenses"
            fields={livingFields}
            values={profile.expenses}
            onChange={(key, value) =>
                updateSection(
                "expenses",
                key,
                value
                )
            }
            />

            <ExpenseBreakdownSection
            title="Transport"
            fields={transportFields}
            values={profile.expenses}
            onChange={(key, value) =>
                updateSection(
                "expenses",
                key,
                value
                )
            }
            />

            <ExpenseBreakdownSection
            title="Medical"
            fields={medicalFields}
            values={profile.expenses}
            onChange={(key, value) =>
                updateSection(
                "expenses",
                key,
                value
                )
            }
            />

            <ExpenseBreakdownSection
            title="Insurance"
            fields={insuranceFields}
            values={profile.expenses}
            onChange={(key, value) =>
                updateSection(
                "expenses",
                key,
                value
                )
            }
            />

            <ExpenseBreakdownSection
            title="Lifestyle"
            fields={lifestyleFields}
            values={profile.expenses}
            onChange={(key, value) =>
                updateSection(
                "expenses",
                key,
                value
                )
            }
            />

          {profile.personal.children > 0 && (
            <section className="bg-white rounded-xl border p-6 mt-8">
              <h2 className="font-semibold text-xl mb-6">
                Children Expenses
              </h2>

              <ChildrenSummary
                children={profile.children}
              />

              <div className="space-y-8 mt-8">
                {profile.children.map(
                  (child, index) => (
                    <ChildCard
                      key={index}
                      child={child}
                      index={index}
                      profile={profile}
                      setProfile={setProfile}
                    />
                  )
                )}
              </div>
            </section>
          )}

        {/* Radds philosophy */}
        <section className="bg-white rounded-xl border p-6 mt-8">
          <h2 className="font-semibold text-xl mb-4">
            The Radds Perspective
          </h2>

          <p className="mb-3">
            Most people think:
          </p>

          <p className="font-semibold mb-5">
            Income − Expenses =
            Savings
          </p>

          <p className="mb-3">
            We encourage:
          </p>

          <p className="font-semibold">
            Income − Investments =
            Lifestyle Spending
          </p>
        </section>

        <div className="mt-8 flex flex-wrap gap-4 items-center">
            <Button
                onClick={handleSave}
            >
                Save Financial Profile
            </Button>

            <button
                disabled
                className="
                px-5
                py-3
                rounded-lg
                border
                border-[#D7E7F7]
                bg-gray-100
                text-gray-500
                cursor-not-allowed
                "
            >
                Export PDF
                <span className="ml-2 text-xs">
                (Coming Soon)
                </span>
            </button>

            <button
                disabled
                className="
                px-5
                py-3
                rounded-lg
                border
                border-[#D7E7F7]
                bg-gray-100
                text-gray-500
                cursor-not-allowed
                "
            >
                Export Excel
                <span className="ml-2 text-xs">
                (Coming Soon)
                </span>
            </button>

            {saved && (
                <span className="text-success">
                Saved Successfully
                </span>
            )}
            </div>
      </div>
    </main>
  );
}
