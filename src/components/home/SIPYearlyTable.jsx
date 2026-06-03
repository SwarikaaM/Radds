import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function fmt(n) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function SIPYearlyTable({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-textmuted hover:text-primary transition-colors font-medium w-full"
      >
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} />
        </motion.span>
        {open ? "Hide" : "View"} Year-wise Breakdown
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-card border border-[#E2EBF5] overflow-hidden">
              <div className="overflow-x-auto max-h-56 overflow-y-auto scrollbar-hide">
                <table className="w-full text-xs">
                  <thead className="bg-lightbg sticky top-0">
                    <tr>
                      {["Year", "Invested", "Returns", "Total Value"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-textmuted font-semibold uppercase tracking-wide text-[10px]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F4F8]">
                    {data.map((row) => (
                      <tr key={row.year} className="hover:bg-lightbg/60 transition-colors">
                        <td className="px-4 py-2.5 font-mono-num font-medium text-textprimary">{row.year}</td>
                        <td className="px-4 py-2.5 font-mono-num text-textmuted">{fmt(row.invested)}</td>
                        <td className="px-4 py-2.5 font-mono-num text-success">{fmt(row.total - row.invested)}</td>
                        <td className="px-4 py-2.5 font-mono-num font-semibold text-secondary">{fmt(row.total)}</td>
                      </tr>
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
