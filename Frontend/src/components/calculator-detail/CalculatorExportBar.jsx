import { FileDown, TableProperties } from "lucide-react";

export default function CalculatorExportBar() {
  return (
    <div className="rounded-xl border border-[#D7E7F7] bg-white p-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h3 className="font-semibold text-textprimary">Export Calculator Report</h3>
          <p className="text-sm text-textmuted mt-0.5">
            Export profile, inputs, graph and results.
            <span className="ml-1.5 text-xs text-accent font-medium">Coming soon</span>
          </p>
        </div>

        <div className="flex gap-3">
          <div className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D7E7F7] bg-[#F8FAFC] text-textmuted text-sm cursor-not-allowed select-none transition-all duration-200 hover:border-[#B8CDE0] hover:bg-[#F0F6FF]">
            <FileDown size={14} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
            Export PDF
          </div>

          <div className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D7E7F7] bg-[#F8FAFC] text-textmuted text-sm cursor-not-allowed select-none transition-all duration-200 hover:border-[#B8CDE0] hover:bg-[#F0F6FF]">
            <TableProperties size={14} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
            Export Excel
          </div>
        </div>
      </div>
    </div>
  );
}