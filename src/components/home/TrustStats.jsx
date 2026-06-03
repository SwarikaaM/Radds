import { Users, Wallet, Award, Star } from "lucide-react";
import Counter from "../ui/Counter";
import ScrollReveal from "../ui/ScrollReveal";
import SectionHeader from "../ui/SectionHeader";

const stats = [
  {
    icon: Users,
    prefix: "",
    end: 10000,
    suffix: "+",
    label: "Happy Clients",
    color: "text-primary",
    bg: "bg-primary/8",
  },
  {
    icon: Wallet,
    prefix: "₹",
    end: 500,
    suffix: " Cr+",
    label: "Assets Managed",
    color: "text-secondary",
    bg: "bg-secondary/8",
  },
  {
    icon: Award,
    prefix: "",
    end: 15,
    suffix: "+",
    label: "Years Market Experience",
    color: "text-accent",
    bg: "bg-accent/8",
  },
  {
    icon: Star,
    prefix: "",
    end: 4.9,
    suffix: "★",
    label: "Average Client Rating",
    color: "text-warning",
    bg: "bg-warning/8",
    decimals: 1,
  },
];

export default function TrustStats() {
  return (
    <section className="bg-lightbg py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Why Radds Capital"
          title="Numbers That Speak For Themselves"
          className="mb-14"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="bg-white rounded-card p-6 shadow-sm border border-[#E2EBF5] text-center hover:shadow-md transition-shadow duration-300">
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon size={22} className={stat.color} />
                  </div>
                  <div className={`text-3xl font-bold mb-1.5 ${stat.color}`}>
                    <Counter
                      prefix={stat.prefix}
                      end={stat.end}
                      suffix={stat.suffix}
                      decimals={stat.decimals || 0}
                    />
                  </div>
                  <p className="text-textmuted text-sm font-medium">{stat.label}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-textmuted text-base leading-relaxed">
              We believe in independent advice.{" "}
              <span className="text-textprimary font-semibold">No hidden commissions.</span>{" "}
              <span className="text-textprimary font-semibold">No product-pushing.</span> Just
              strategy designed around your life goals — whether you're just starting out or
              growing a significant corpus.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
