import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatINR } from "../../utils/format";

function formatCell(val, colKey) {
  if (colKey === "year") return val;
  if (typeof val === "number") return formatINR(val);
  return val ?? "—";
}

export default function CalculatorYearlyTable({ tableColumns, tableRowKeys, chartData }) {
  const [open, setOpen] = useState(false);

  if (!chartData?.length) return null;

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-textmuted hover:text-primary transition-colors w-full group"
        aria-expanded={open}
      >
        <span className="flex items-center gap-1.5">
          {open
            ? <ChevronUp size={15} className="text-primary" />
            : <ChevronDown size={15} />}
          <span className="group-hover:text-primary transition-colors">
            {open ? "Hide" : "View"} Year-wise Breakdown
          </span>
        </span>
        <span className="ml-auto text-[11px] text-textmuted/60 font-mono-num">
          {chartData.length} rows
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-card border border-[#E2EBF5] overflow-hidden">
              <div className="overflow-x-auto max-h-72 overflow-y-auto scrollbar-hide">
                <table className="w-full text-xs min-w-[480px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#F4F8FC]">
                      {tableColumns.map((col) => (
                        <th
                          key={col}
                          className="px-4 py-3 text-left text-textmuted font-semibold uppercase tracking-wide text-[10px] whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((row, i) => (
                      <motion.tr
                        key={row.year}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.18, delay: Math.min(i * 0.018, 0.3) }}
                        className={`border-t border-[#F0F4F8] transition-colors duration-150 cursor-default ${
                          i % 2 === 0 ? "bg-white hover:bg-primary/[0.03]" : "bg-[#FAFBFD] hover:bg-primary/[0.04]"
                        }`}
                      >
                        {tableRowKeys.map((rk) => (
                          <td
                            key={rk}
                            className={`px-4 py-2.5 font-mono-num whitespace-nowrap ${
                              rk === "year"
                                ? "font-semibold text-textprimary"
                                : rk.toLowerCase().includes("return") ||
                                  rk === "returns" ||
                                  rk === "growth"
                                ? "text-success"
                                : rk === "total" ||
                                  rk === "closingCorpus" ||
                                  rk === "startNow"
                                ? "font-semibold text-secondary"
                                : rk === "difference"
                                ? "text-warning font-semibold"
                                : "text-textmuted"
                            }`}
                          >
                            {formatCell(row[rk], rk)}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
