import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

function fmt(n) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  return `${(n / 1000).toFixed(0)}K`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark/95 border border-white/15 rounded-card p-3 shadow-xl text-xs">
      <p className="text-white/60 mb-2 font-medium">Year {label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-mono-num">
          {p.name}: ₹{(p.value / 100000).toFixed(2)}L
        </p>
      ))}
    </div>
  );
};

export default function SIPGrowthChart({ data }) {
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22568F" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22568F" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="returnsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#39C3EF" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#39C3EF" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2EBF5" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 10, fill: "#6B7E99", fontFamily: "JetBrains Mono" }}
            tickLine={false}
            axisLine={false}
            label={{ value: "Year", position: "insideBottomRight", offset: -4, fontSize: 10, fill: "#6B7E99" }}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fontSize: 10, fill: "#6B7E99", fontFamily: "JetBrains Mono" }}
            tickLine={false}
            axisLine={false}
            width={42}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "#6B7E99", paddingTop: "8px" }}
            iconType="circle"
            iconSize={7}
          />
          <Area
            type="monotone"
            dataKey="invested"
            name="Invested"
            stroke="#22568F"
            strokeWidth={2}
            fill="url(#investedGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#22568F" }}
          />
          <Area
            type="monotone"
            dataKey="total"
            name="Total Value"
            stroke="#39C3EF"
            strokeWidth={2}
            fill="url(#returnsGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#39C3EF" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
