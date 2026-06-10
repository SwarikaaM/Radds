import { Info } from "lucide-react";

export default function CalculatorAssumptions() {
  return (
    <div className="flex items-start gap-3 bg-[#F4F8FC] border border-[#E2EBF5] rounded-card p-4">
      <Info size={15} className="text-textmuted flex-shrink-0 mt-0.5" />
      <p className="text-textmuted text-xs leading-relaxed">
        <span className="font-semibold text-textprimary">Disclaimer: </span>
        These results are illustrative estimates based on the inputs provided. Actual returns may vary due to
        market conditions, fund performance, expenses, exit loads, and taxes. Mutual Fund investments are subject 
        to market risks. Read all scheme-related documents carefully before investing. 
        Past performance is not indicative of future returns. 
        This calculator is a planning tool only and does not constitute investment advice. 
        Consult a SEBI Registered Investment Adviser for personalised advice.
      </p>
    </div>
  );
}
