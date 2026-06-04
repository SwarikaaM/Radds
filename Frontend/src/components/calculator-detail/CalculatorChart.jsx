import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { motion } from "framer-motion";
import { formatINR, formatAxis } from "../../utils/format";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark/95 border border-white/15 rounded-card p-3.5 shadow-xl text-xs min-w-[160px]">
      <p className="text-white/50 mb-2 font-medium">Year {label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-mono-num font-semibold" style={{ color: p.color }}>
            {formatINR(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function CalculatorChart({ chartData, chartSeries }) {
  if (!chartData?.length) return null;

  // Derive a stable key from the last data point so the chart
  // only re-mounts when data actually changes, not on every render
  const chartKey = chartData[chartData.length - 1]
    ? Object.values(chartData[chartData.length - 1]).join("-")
    : "empty";

  return (
    <div>
      <p className="text-textmuted text-xs font-semibold uppercase tracking-wide mb-4">
        Growth Over Time
      </p>
      <motion.div
        className="h-64 w-full"
        key={chartKey}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              {chartSeries.map((s, i) => (
                <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={i === 0 ? 0.3 : 0.45} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EFF5" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 10, fill: "#6B7E99", fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={false}
              label={{ value: "Year", position: "insideBottomRight", offset: -4, fontSize: 10, fill: "#6B7E99" }}
            />
            <YAxis
              tickFormatter={formatAxis}
              tick={{ fontSize: 10, fill: "#6B7E99", fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={false}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", color: "#6B7E99", paddingTop: "10px" }}
              iconType="circle"
              iconSize={7}
            />
            {chartSeries.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#grad-${s.key})`}
                dot={false}
                activeDot={{ r: 4, fill: s.color, strokeWidth: 0 }}
                isAnimationActive={true}
                animationDuration={400}
                animationEasing="ease-out"
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}