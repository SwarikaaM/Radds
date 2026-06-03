/**
 * Format numbers in Indian currency style: ₹1,00,000
 */
export function formatINR(n, compact = false) {
  if (n === undefined || n === null || isNaN(n)) return "₹0";
  const abs = Math.abs(Math.round(n));
  const sign = n < 0 ? "-" : "";

  if (compact) {
    if (abs >= 10_000_000) return `${sign}₹${(abs / 10_000_000).toFixed(2)} Cr`;
    if (abs >= 100_000) return `${sign}₹${(abs / 100_000).toFixed(2)} L`;
    if (abs >= 1_000) return `${sign}₹${(abs / 1_000).toFixed(1)}K`;
    return `${sign}₹${abs.toLocaleString("en-IN")}`;
  }

  return `${sign}₹${abs.toLocaleString("en-IN")}`;
}

export function formatCompact(n) {
  return formatINR(n, true);
}

/** For axis labels on charts */
export function formatAxis(n) {
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `${(n / 100_000).toFixed(0)}L`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}
