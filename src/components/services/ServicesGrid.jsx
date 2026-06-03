import {
  TrendingUp,
  Shield,
  BarChart2,
  CreditCard,
  Repeat,
  FileText,
  Landmark,
  Lock,
  Target,
  PieChart,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import Card from "../ui/Card";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";

const iconMap = {
  TrendingUp,
  Shield,
  BarChart2,
  CreditCard,
  Repeat,
  FileText,
  Landmark,
  Lock,
  Target,
  PieChart,
};

const services = [
  {
    title: "Mutual Funds",
    slug: "mutual-funds",
    icon: "TrendingUp",
    description:
      "Professionally managed funds aligned to your risk profile.",
    benefits: [
      "Diversified investing",
      "Long-term wealth creation",
      "Expert fund selection",
    ],
  },
  {
    title: "Life & Health Insurance",
    slug: "life-health-insurance",
    icon: "Shield",
    description:
      "Protect your family and finances from unexpected events.",
    benefits: [
      "Financial protection",
      "Medical coverage",
      "Family security",
    ],
  },
  {
    title: "Equity & Shares",
    slug: "equity-shares",
    icon: "BarChart2",
    description:
      "Research-backed investing opportunities for growth seekers.",
    benefits: [
      "Direct equity exposure",
      "Growth potential",
      "Market insights",
    ],
  },
  {
    title: "Demat Account",
    slug: "demat-account",
    icon: "CreditCard",
    description:
      "Easy onboarding and secure access to market investments.",
    benefits: [
      "Paperless setup",
      "Safe holdings",
      "Quick activation",
    ],
  },
  {
    title: "SIP Planning",
    slug: "sip-planning",
    icon: "Repeat",
    description:
      "Disciplined investing strategies aligned with future goals.",
    benefits: [
      "Goal-focused planning",
      "Rupee cost averaging",
      "Flexible contributions",
    ],
  },
  {
    title: "Tax Planning (ELSS)",
    slug: "tax-planning",
    icon: "FileText",
    description:
      "Reduce taxes while building long-term wealth efficiently.",
    benefits: [
      "Section 80C benefits",
      "Tax-efficient investing",
      "Wealth creation",
    ],
  },
  {
    title: "NPS / Retirement",
    slug: "nps-retirement",
    icon: "Landmark",
    description:
      "Retirement solutions designed for financial independence.",
    benefits: [
      "Retirement corpus",
      "Tax advantages",
      "Regular pension income",
    ],
  },
  {
    title: "Fixed Deposits & Bonds",
    slug: "fixed-deposits-bonds",
    icon: "Lock",
    description:
      "Stable income products for conservative investors.",
    benefits: [
      "Predictable returns",
      "Capital preservation",
      "Lower volatility",
    ],
  },
  {
    title: "Goal-Based Planning",
    slug: "goal-based-planning",
    icon: "Target",
    description:
      "Financial strategies built around life's major milestones.",
    benefits: [
      "Education planning",
      "Home purchase goals",
      "Future readiness",
    ],
  },
  {
    title: "Portfolio Review",
    slug: "portfolio-review",
    icon: "PieChart",
    description:
      "Identify gaps and optimize your current investments.",
    benefits: [
      "Risk assessment",
      "Rebalancing insights",
      "Performance review",
    ],
  },
];

export default function ServicesGrid() {
  return (
    <section className="py-24 bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="Services"
          title="Comprehensive Financial Solutions"
          subtitle="Every recommendation is aligned with your goals, risk appetite and investment horizon."
        />

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-16">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];

            return (
              <ScrollReveal key={service.slug} delay={index * 0.05}>
                <Card hover glow className="h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon size={24} className="text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold text-textprimary mb-3">
                    {service.title}
                  </h3>

                  <p className="text-textmuted mb-5">
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-8 flex-1">
                    {service.benefits.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-textmuted"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-success mt-0.5"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Button
                    href={`/services/${service.slug}`}
                    variant="outline"
                    className="w-full justify-center"
                  >
                    Explore
                    <ArrowRight size={16} />
                  </Button>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}