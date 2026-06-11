import { useState, useMemo } from "react";
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/useProfile';

import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";
import SIPInputPanel from "./SIPInputPanel";
import SIPSummaryCards from "./SIPSummaryCards";
import SIPGrowthChart from "./SIPGrowthChart";
import SIPYearlyTable from "./SIPYearlyTable";
import SignupPromptCard from "./SignupPromptCard";

function calcSIP(monthly, rateAnnual, years) {
  const n = years * 12;
  const r = rateAnnual / 12 / 100;
  const total = monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  const invested = monthly * n;
  return { total: Math.round(total), invested, returns: Math.round(total - invested) };
}

function buildChartData(monthly, rateAnnual, years) {
  const r = rateAnnual / 12 / 100;
  return Array.from({ length: years }, (_, i) => {
    const n = (i + 1) * 12;
    const total = monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    return {
      year: i + 1,
      invested: monthly * n,
      total: Math.round(total),
    };
  });
}

function ProfileCapacityPill({ setMonthly }) {
  const { user } = useAuth();
  const { hasProfile, totals } = useProfile();

  if (!user || !hasProfile || !totals?.investmentCapacity) return null;

  return (
    <div className="rounded-lg bg-[#F4F8FC] border border-[#D7E7F7] p-3 flex items-center justify-between gap-3">
      <div>
        <p className="text-xs text-[#6B7E99]">From your profile</p>
        <p className="text-sm font-bold text-[#22568F]">
          ₹{totals.investmentCapacity.toLocaleString('en-IN')}/mo available
        </p>
      </div>
      <button
        onClick={() => setMonthly(totals.investmentCapacity)}
        className="text-xs font-medium text-white bg-[#22568F] px-3 py-1.5 rounded-lg hover:bg-[#1a4070] transition-colors whitespace-nowrap"
      >
        Use This
      </button>
    </div>
  );
}

export default function FeaturedCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const { invested, returns, total } = useMemo(() => calcSIP(monthly, rate, years), [monthly, rate, years]);
  const chartData = useMemo(() => buildChartData(monthly, rate, years), [monthly, rate, years]);

  return (
    <section className="bg-lightbg py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="SIP Calculator"
          title="See Your Money Grow"
          subtitle="Adjust the sliders to instantly see how your SIP builds wealth over time."
          className="mb-8"
        />

        <ScrollReveal>
          <div className="bg-white rounded-[16px] border border-[#E2EBF5] shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-[#E2EBF5]">
              {/* Input panel */}
              <div className="p-7 space-y-7">
                <div>
                  <h3 className="text-textprimary font-semibold text-base mb-0.5">Configure Your SIP</h3>
                  <p className="text-textmuted text-xs">Drag sliders to update projections live</p>
                </div>
                <SIPInputPanel
                  monthly={monthly} setMonthly={setMonthly}
                  rate={rate} setRate={setRate}
                  years={years} setYears={setYears}
                />

                {/* Quick presets */}
                <div>
                  <p className="text-textmuted text-xs mb-2 font-medium">Quick Presets</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { m: 2000, r: 12, y: 10, label: 'Starter' },
                      { m: 5000, r: 12, y: 15, label: 'Growth' },
                      { m: 10000, r: 14, y: 20, label: 'Wealth' },
                    ].map((p) => (
                      <button
                        key={p.label}
                        onClick={() => { setMonthly(p.m); setRate(p.r); setYears(p.y); }}
                        className="px-3 py-1.5 text-xs rounded-full border border-[#E2EBF5] text-textmuted hover:border-primary hover:text-primary transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile capacity pill — only shown when logged in with profile */}
                <ProfileCapacityPill setMonthly={setMonthly} />
              </div>

              {/* Output panel */}
              <div className="p-7 space-y-6 flex flex-col">
                <SIPSummaryCards invested={invested} returns={returns} total={total} />
                <div className="flex-1">
                  <p className="text-textmuted text-xs font-medium mb-3 uppercase tracking-wide">Invested vs Total Value Over Time</p>
                  <SIPGrowthChart data={chartData} />
                </div>
                <SIPYearlyTable data={chartData} />
                <SignupPromptCard />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
