import {
  Briefcase,
  Users,
  Landmark,
  Star,
} from "lucide-react";

const stats = [
  {
    icon: Briefcase,
    value: "8+",
    label: "Years in Business",
  },
  {
    icon: Users,
    value: "1,000+",
    label: "Clients Served",
  },
  {
    icon: Landmark,
    value: "₹60 Cr+",
    label: "AUM",
  },
  {
    icon: Star,
    value: "4.9★",
    label: "Client Rating",
  },
];

export default function AchievementsBanner() {
  return (
    <section className="bg-[#0D1B2E] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
              >
                <Icon
                  className="mx-auto mb-4 text-[#39C3EF]"
                  size={28}
                />

                <h3 className="font-mono text-3xl font-bold text-white mb-2">
                  {item.value}
                </h3>

                <p className="text-white/70">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}