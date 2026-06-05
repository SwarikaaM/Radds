import { useParams, Navigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";

import { calculatorRegistry, getDefaultValues } from "../data/calculatorRegistry";

import CalculatorHero from "../components/calculator-detail/CalculatorHero";
import CalculatorInputPanel from "../components/calculator-detail/CalculatorInputPanel";
import CalculatorSummary from "../components/calculator-detail/CalculatorSummary";
import CalculatorChart from "../components/calculator-detail/CalculatorChart";
import CalculatorYearlyTable from "../components/calculator-detail/CalculatorYearlyTable";
import CalculatorAssumptions from "../components/calculator-detail/CalculatorAssumptions";
import CalculatorSignupPrompt from "../components/calculator-detail/CalculatorSignupPrompt";
import RelatedCalculators from "../components/calculator-detail/RelatedCalculators";
import CalculatorDetailFAQ from "../components/calculator-detail/CalculatorDetailFAQ";
import ProfileCapacityBanner from "../components/calculator-detail/ProfileCapacityBanner";
import CalculatorProfileSummary from "../components/calculator-detail/CalculatorProfileSummary";
import CalculatorExportBar from "../components/calculator-detail/CalculatorExportBar";

export default function CalculatorDetail() {
  const { slug } = useParams();
  const config = calculatorRegistry[slug];

  // Inputs state — initialised from config defaults (must be before any conditional return)
  const [values, setValues] = useState(() => config ? getDefaultValues(config) : {});

  // Set document title
  useEffect(() => {
    if (!config) return;
    document.title = `${config.title} | Radds Capital`;
  }, [config]);

  // Reset inputs when slug changes (navigating between calculators)
  useEffect(() => {
    if (!config) return;
    setValues(getDefaultValues(config));
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect unknown slugs to calculators list (after all hooks)
  if (!config) return <Navigate to="/calculators" replace />;

  // Computed results — instant, no debounce needed (pure math)
  const results = useMemo(() => config.compute(values), [config, values]);
  const chartData = useMemo(() => config.buildChartData(values), [config, values]);

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────── */}
      <CalculatorHero title={config.title} description={config.description} />

      {/* ── 2. Calculator Panel ─────────────────────────────────────── */}
      <section id="calculator-panel" className="bg-lightbg py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[16px] border border-[#E2EBF5] shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-[#E2EBF5]">

              {/* Left — Inputs */}
              <div className="p-7 lg:p-8">
                <CalculatorProfileSummary />
                <ProfileCapacityBanner />
                <CalculatorInputPanel
                  inputs={config.inputs}
                  values={values}
                  onChange={setValues}
                />
              </div>

              {/* Right — Outputs */}
              <div className="p-7 lg:p-8 space-y-7 flex flex-col">

                {/* ── 3. Summary Cards */}
                <CalculatorSummary
                  summaryKeys={config.summaryKeys}
                  results={results}
                />

                {/* ── 4. Chart */}
                <CalculatorChart
                  chartData={chartData}
                  chartSeries={config.chartSeries}
                />

                {/* ── 5. Yearly Table */}
                <CalculatorYearlyTable
                  tableColumns={config.tableColumns}
                  tableRowKeys={config.tableRowKeys}
                  chartData={chartData}
                />

                <CalculatorExportBar />
                {/* ── 6. Assumptions */}
                <CalculatorAssumptions />

                {/* ── 7. Signup Prompt */}
                <CalculatorSignupPrompt />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Related Calculators */}
      <RelatedCalculators currentSlug={slug} />

      {/* ── 9. Calculator-specific FAQ */}
      <CalculatorDetailFAQ
        faqs={config.faqs}
        calculatorTitle={config.shortTitle}
      />
    </>
  );
}
