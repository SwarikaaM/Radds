import { TrendingUp, TrendingDown } from "lucide-react";

const marketData = [
  { label: "NIFTY 50", value: "24,286.50", change: "+1.24%", up: true },
  { label: "SENSEX", value: "79,943.15", change: "+1.18%", up: true },
  { label: "Gold", value: "₹72,450/10g", change: "-0.32%", up: false },
  { label: "USD/INR", value: "₹83.42", change: "+0.08%", up: true },
  { label: "Large Cap MF NAV", value: "₹58.24", change: "+0.91%", up: true },
  { label: "Flexi Cap MF NAV", value: "₹94.67", change: "+1.05%", up: true },
];

function TickerItem({ item }) {
  return (
    <span className="flex items-center gap-2 px-5 border-r border-white/10 flex-shrink-0">
      <span className="text-white/50 text-xs uppercase tracking-wider">{item.label}</span>
      <span className="text-white font-mono-num text-xs font-medium">{item.value}</span>
      <span
        className={`flex items-center gap-0.5 text-xs font-mono-num font-semibold ${
          item.up ? "text-success" : "text-red-400"
        }`}
      >
        {item.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {item.change}
      </span>
    </span>
  );
}

export default function MarketTicker() {
  const doubled = [...marketData, ...marketData];

  return (
    <div className="bg-dark/95 border-y border-white/8 h-9 flex items-center overflow-hidden">
      <div className="flex-shrink-0 px-4 border-r border-white/10">
        <span className="text-accent text-[10px] font-semibold uppercase tracking-widest">Live Markets</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="marquee-track">
          {doubled.map((item, i) => (
            <TickerItem key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
