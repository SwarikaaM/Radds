import { Info } from "lucide-react";

export default function CalculatorAssumptions() {
  return (
    <div className="flex items-start gap-3 bg-[#F4F8FC] border border-[#E2EBF5] rounded-card p-4">
      <Info size={15} className="text-textmuted flex-shrink-0 mt-0.5" />
      <p className="text-textmuted text-xs leading-relaxed">
        <span className="font-semibold text-textprimary">Disclaimer: </span>
        These results are estimates based on the inputs provided. Actual returns may vary due to
        market conditions, fund expenses, exit loads, taxes, and product selection. Past
        performance is not indicative of future returns. Please consult a SEBI Registered
        Investment Advisor before making financial decisions.
      </p>
    </div>
  );
}
