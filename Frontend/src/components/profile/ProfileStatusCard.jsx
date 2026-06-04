import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateTotals } from "../../utils/financialProfile";

function AnimatedValue({ value, className, prefix = "₹", color = "" }) {
  const [display, setDisplay] = useState(value);
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(value);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) return;

    setFlash(true);
    setTimeout(() => setFlash(false), 400);

    const duration = 350;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = to;
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  return (
    <motion.p
      className={`font-bold font-mono-num ${className} ${color} transition-colors duration-300`}
      animate={flash ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      {prefix}{display.toLocaleString("en-IN")}
    </motion.p>
  );
}

export default function ProfileStatusCard({ profile }) {
  const totals = calculateTotals(profile);

  const isComplete =
    profile.personal.name &&
    profile.personal.email &&
    profile.personal.phone;

  return (
    <section className="bg-white rounded-xl border p-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-xl">Profile Status</h2>
          <p className="text-[#6B7E99] mt-1">Used across calculators.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isComplete ? "active" : "incomplete"}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              isComplete
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {isComplete ? "Active" : "Incomplete"}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-6">
        <div>
          <p className="text-xs text-[#6B7E99] mb-1">Monthly Income</p>
          <AnimatedValue value={totals.totalIncome} className="text-xl" />
        </div>

        <div>
          <p className="text-xs text-[#6B7E99] mb-1">Monthly Expenses</p>
          <AnimatedValue value={totals.totalExpenses} className="text-xl" />
        </div>

        <div>
          <p className="text-xs text-[#6B7E99] mb-1">Investment Capacity</p>
          <AnimatedValue
            value={totals.investmentCapacity}
            className="text-xl"
            color={totals.investmentCapacity >= 0 ? "text-success" : "text-red-500"}
          />
        </div>
      </div>
    </section>
  );
}