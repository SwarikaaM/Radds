import {
  TrendingUp,
  Shield,
  BarChart3,
  CreditCard,
  Repeat,
  FileText,
  Landmark,
  Lock,
  Target,
  PieChart,
} from "lucide-react";

export const serviceDetails = {
  "mutual-funds": {
    name: "Mutual Funds",
    tagline: "Professional investing made simple.",
    icon: TrendingUp,

    description:
      "Mutual funds pool money from many investors and invest across a diversified portfolio. They are designed to help investors build wealth over time without having to select and manage individual securities.",

    steps: [
      "Understand your financial goals",
      "Assess your risk profile",
      "Select suitable mutual funds",
      "Monitor and review periodically",
    ],

    benefits: [
      {
        title: "Diversification",
        description: "Spread investments across multiple assets.",
      },
      {
        title: "Professional Management",
        description: "Managed by experienced fund managers.",
      },
      {
        title: "Flexible Investing",
        description: "Start small through SIPs.",
      },
      {
        title: "Goal Alignment",
        description: "Choose funds matching your objectives.",
      },
    ],

    audience: [
      {
        title: "Young Professional",
        description: "Building long-term wealth early.",
      },
      {
        title: "Family Planner",
        description: "Saving for education or major goals.",
      },
      {
        title: "Long-Term Investor",
        description: "Focused on wealth creation over years.",
      },
    ],

    risks: [
      "Market volatility can affect returns.",
      "Returns are not guaranteed.",
      "Short-term losses are possible.",
    ],

    faqs: [
      {
        question: "What is a mutual fund?",
        answer:
          "A professionally managed investment vehicle that pools money from multiple investors.",
      },
      {
        question: "Can I start with a small amount?",
        answer:
          "Yes, many SIPs start from ₹500 per month.",
      },
      {
        question: "Are mutual funds safe?",
        answer:
          "They are regulated but remain subject to market risk.",
      },
      {
        question: "How often should I review investments?",
        answer:
          "At least once or twice a year.",
      },
      {
        question: "Can I withdraw anytime?",
        answer:
          "Most open-ended funds allow redemption at any time.",
      },
    ],

    related: ["sip-planning", "goal-based-planning", "portfolio-review"],
  },

  "life-health-insurance": {
    name: "Life & Health Insurance",
    tagline: "Protect your family and financial future.",
    icon: Shield,

    description:
      "Insurance helps reduce financial stress caused by unforeseen events such as illness, hospitalization, disability, or loss of income. Proper coverage protects both your family and long-term goals.",

    steps: [
      "Assess coverage requirements",
      "Compare suitable plans",
      "Complete application process",
      "Review coverage periodically",
    ],

    benefits: [
      {
        title: "Family Protection",
        description: "Financial support for dependents.",
      },
      {
        title: "Medical Coverage",
        description: "Protection from healthcare expenses.",
      },
      {
        title: "Peace of Mind",
        description: "Reduced financial uncertainty.",
      },
      {
        title: "Long-Term Security",
        description: "Safeguard future financial plans.",
      },
    ],

    audience: [
      {
        title: "Working Professional",
        description: "Protecting income and dependents.",
      },
      {
        title: "Family Planner",
        description: "Securing family financial stability.",
      },
      {
        title: "Business Owner",
        description: "Managing financial risks effectively.",
      },
    ],

    risks: [
      "Insufficient coverage may leave protection gaps.",
      "Policy terms vary significantly.",
      "Delayed disclosure can impact claims.",
    ],

    faqs: [
      {
        question: "Why do I need life insurance?",
        answer:
          "It provides financial protection to your family if something happens to you.",
      },
      {
        question: "How much coverage should I have?",
        answer:
          "Coverage should align with income, liabilities, and family needs.",
      },
      {
        question: "What is health insurance?",
        answer:
          "It helps cover hospitalization and medical expenses.",
      },
      {
        question: "Can I have multiple policies?",
        answer:
          "Yes, many individuals maintain multiple policies.",
      },
      {
        question: "When should I buy insurance?",
        answer:
          "The earlier you buy, the lower premiums generally are.",
      },
    ],

    related: ["goal-based-planning", "portfolio-review", "nps-retirement"],
  },

  "equity-shares": {
    name: "Equity & Shares",
    tagline: "Participate directly in business growth.",
    icon: BarChart3,

    description:
      "Equity investing involves purchasing ownership in companies through stock markets. It offers higher growth potential but also comes with higher volatility.",

    steps: [
      "Define investment objectives",
      "Open a trading account",
      "Research investment opportunities",
      "Monitor and rebalance holdings",
    ],

    benefits: [
      {
        title: "Growth Potential",
        description: "Opportunity for substantial wealth creation.",
      },
      {
        title: "Ownership",
        description: "Participate in company success.",
      },
      {
        title: "Liquidity",
        description: "Buy and sell on exchanges.",
      },
      {
        title: "Dividend Income",
        description: "Potential additional cash flow.",
      },
    ],

    audience: [
      {
        title: "Aggressive Investor",
        description: "Seeking long-term capital appreciation.",
      },
      {
        title: "Market Enthusiast",
        description: "Interested in direct investing.",
      },
      {
        title: "Experienced Investor",
        description: "Comfortable with market volatility.",
      },
    ],

    risks: [
      "Higher market volatility.",
      "Potential capital loss.",
      "Requires ongoing monitoring.",
    ],

    faqs: [
      {
        question: "Are stocks risky?",
        answer:
          "Yes, stock prices fluctuate and can result in losses.",
      },
      {
        question: "Can stocks beat inflation?",
        answer:
          "Historically, equities have outpaced inflation over long periods.",
      },
      {
        question: "How much should I invest?",
        answer:
          "It depends on goals, income, and risk tolerance.",
      },
      {
        question: "Do stocks provide regular income?",
        answer:
          "Some companies distribute dividends.",
      },
      {
        question: "Should beginners invest in stocks?",
        answer:
          "Beginners often start with diversified strategies first.",
      },
    ],

    related: ["mutual-funds", "portfolio-review", "demat-account"],
  },

  "demat-account": {
    name: "Demat Account",
    tagline: "Your gateway to modern investing.",
    icon: CreditCard,

    description:
      "A Demat account stores shares and securities electronically, making investing convenient, secure, and paperless.",

    steps: [
      "Choose a provider",
      "Submit KYC documents",
      "Complete verification",
      "Start investing",
    ],

    benefits: [
      {
        title: "Paperless Holdings",
        description: "Secure electronic storage.",
      },
      {
        title: "Convenience",
        description: "Easy management of investments.",
      },
      {
        title: "Fast Transactions",
        description: "Quick settlement process.",
      },
      {
        title: "Security",
        description: "Reduced risk of physical certificates.",
      },
    ],

    audience: [
      {
        title: "New Investor",
        description: "Starting investment journey.",
      },
      {
        title: "Stock Investor",
        description: "Buying and holding shares.",
      },
      {
        title: "Mutual Fund Investor",
        description: "Managing digital investments.",
      },
    ],

    risks: [
      "Annual maintenance charges may apply.",
      "Trading without research can be risky.",
      "Account security should be maintained.",
    ],

    faqs: [
      {
        question: "Is a Demat account mandatory?",
        answer:
          "Yes, for holding listed securities electronically.",
      },
      {
        question: "Can I have multiple Demat accounts?",
        answer:
          "Yes, subject to regulations.",
      },
      {
        question: "What documents are needed?",
        answer:
          "PAN, Aadhaar, and address proof are commonly required.",
      },
      {
        question: "How long does opening take?",
        answer:
          "Often completed within a few days.",
      },
      {
        question: "Are shares stored physically?",
        answer:
          "No, they are held electronically.",
      },
    ],

    related: ["equity-shares", "mutual-funds", "portfolio-review"],
  },

  "sip-planning": {
    name: "SIP Planning",
    tagline: "Invest consistently toward future goals.",
    icon: Repeat,

    description:
      "Systematic Investment Plans allow you to invest fixed amounts regularly and build wealth through disciplined investing.",

    steps: [
      "Define goals",
      "Choose investment amount",
      "Select suitable funds",
      "Track progress",
    ],

    benefits: [
      {
        title: "Discipline",
        description: "Build investing habits.",
      },
      {
        title: "Affordability",
        description: "Start with small amounts.",
      },
      {
        title: "Compounding",
        description: "Long-term wealth creation.",
      },
      {
        title: "Consistency",
        description: "Invest regularly regardless of market levels.",
      },
    ],

    audience: [
      {
        title: "First-Time Investor",
        description: "Starting wealth creation.",
      },
      {
        title: "Salary Earner",
        description: "Monthly investment planning.",
      },
      {
        title: "Goal Seeker",
        description: "Building future financial security.",
      },
    ],

    risks: [
      "Returns depend on market performance.",
      "Stopping SIPs frequently may impact goals.",
      "Short-term volatility remains possible.",
    ],

    faqs: [
      {
        question: "What is SIP?",
        answer:
          "A method of investing fixed amounts regularly into mutual funds.",
      },
      {
        question: "Can I stop SIP anytime?",
        answer:
          "Yes, SIPs are generally flexible.",
      },
      {
        question: "Does SIP guarantee returns?",
        answer:
          "No, returns depend on markets.",
      },
      {
        question: "Can I increase SIP amount?",
        answer:
          "Yes, many funds support step-up SIPs.",
      },
      {
        question: "How long should I continue?",
        answer:
          "Longer durations generally improve outcomes.",
      },
    ],

    related: ["mutual-funds", "goal-based-planning", "portfolio-review"],
  },

  "tax-planning": {
    name: "Tax Planning (ELSS)",
    tagline: "Save taxes while building wealth.",
    icon: FileText,
    description:
      "ELSS and tax-planning strategies help reduce taxable income while supporting long-term financial goals.",
    steps: [
      "Review tax liabilities",
      "Identify eligible deductions",
      "Select tax-efficient investments",
      "Review annually",
    ],
    benefits: [
      { title: "Tax Savings", description: "Reduce tax burden legally." },
      { title: "Wealth Creation", description: "Invest while saving taxes." },
      { title: "Efficient Planning", description: "Better financial outcomes." },
      { title: "Goal Support", description: "Align tax strategy with goals." },
    ],
    audience: [
      { title: "Salary Earner", description: "Optimizing annual taxes." },
      { title: "Professional", description: "Balancing growth and tax savings." },
      { title: "Investor", description: "Seeking tax-efficient returns." },
    ],
    risks: [
      "Tax laws can change.",
      "Investment returns are not guaranteed.",
      "Incorrect planning may reduce efficiency.",
    ],
    faqs: [],
    related: ["mutual-funds", "sip-planning", "goal-based-planning"],
  },

  "nps-retirement": {
    name: "NPS / Retirement Planning",
    tagline: "Build a financially independent retirement.",
    icon: Landmark,
    description:
      "Retirement planning helps create a sustainable income stream for life after active employment.",
    steps: [
      "Estimate retirement needs",
      "Assess current savings",
      "Build retirement portfolio",
      "Review annually",
    ],
    benefits: [
      { title: "Retirement Corpus", description: "Build long-term wealth." },
      { title: "Tax Benefits", description: "Potential tax advantages." },
      { title: "Regular Income", description: "Support retirement lifestyle." },
      { title: "Long-Term Focus", description: "Structured planning approach." },
    ],
    audience: [
      { title: "Young Professional", description: "Starting early." },
      { title: "Mid-Career Individual", description: "Growing retirement savings." },
      { title: "Pre-Retiree", description: "Preparing retirement income." },
    ],
    risks: [
      "Inflation may reduce purchasing power.",
      "Late planning may require larger investments.",
      "Market-linked products can fluctuate.",
    ],
    faqs: [],
    related: ["goal-based-planning", "portfolio-review", "mutual-funds"],
  },

  "fixed-deposits-bonds": {
    name: "Fixed Deposits & Bonds",
    tagline: "Stability and predictable income.",
    icon: Lock,
    description:
      "Fixed-income products provide relatively stable returns and are commonly used for capital preservation.",
    steps: [
      "Assess income needs",
      "Choose suitable products",
      "Allocate funds",
      "Monitor maturity schedule",
    ],
    benefits: [
      { title: "Stability", description: "Lower volatility." },
      { title: "Predictability", description: "Known return expectations." },
      { title: "Capital Preservation", description: "Protect principal." },
      { title: "Income Generation", description: "Regular interest earnings." },
    ],
    audience: [
      { title: "Conservative Investor", description: "Seeking stability." },
      { title: "Retiree", description: "Looking for income." },
      { title: "Risk-Averse Saver", description: "Preserving capital." },
    ],
    risks: [
      "Inflation may reduce real returns.",
      "Interest rates may change.",
      "Some bonds carry credit risk.",
    ],
    faqs: [],
    related: ["nps-retirement", "portfolio-review", "goal-based-planning"],
  },

  "goal-based-planning": {
    name: "Goal-Based Planning",
    tagline: "Invest with purpose and direction.",
    icon: Target,
    description:
      "Goal-based planning aligns investments with specific milestones such as education, home purchase, travel, or retirement.",
    steps: [
      "Define goals",
      "Estimate future costs",
      "Create investment plan",
      "Track progress regularly",
    ],
    benefits: [
      { title: "Clarity", description: "Clear financial roadmap." },
      { title: "Focus", description: "Avoid random investing." },
      { title: "Better Decisions", description: "Prioritize goals effectively." },
      { title: "Progress Tracking", description: "Measure advancement easily." },
    ],
    audience: [
      { title: "Young Professional", description: "Planning future milestones." },
      { title: "Family Planner", description: "Managing multiple goals." },
      { title: "Retirement Planner", description: "Preparing long-term objectives." },
    ],
    risks: [
      "Unrealistic assumptions may affect outcomes.",
      "Goals may evolve over time.",
      "Inflation can increase future costs.",
    ],
    faqs: [],
    related: ["sip-planning", "mutual-funds", "portfolio-review"],
  },

  "portfolio-review": {
    name: "Portfolio Review",
    tagline: "Ensure your investments stay aligned.",
    icon: PieChart,
    description:
      "Portfolio reviews help identify gaps, rebalance allocations, and improve alignment between investments and financial goals.",
    steps: [
      "Analyze current holdings",
      "Assess risk exposure",
      "Identify gaps and opportunities",
      "Implement recommendations",
    ],
    benefits: [
      { title: "Risk Management", description: "Identify concentration risks." },
      { title: "Better Allocation", description: "Optimize asset mix." },
      { title: "Performance Review", description: "Evaluate progress." },
      { title: "Goal Alignment", description: "Stay on track." },
    ],
    audience: [
      { title: "Existing Investor", description: "Reviewing current portfolio." },
      { title: "High-Net-Worth Individual", description: "Managing complexity." },
      { title: "Retirement Planner", description: "Ensuring readiness." },
    ],
    risks: [
      "Past performance may not continue.",
      "Frequent changes may increase costs.",
      "Market uncertainty remains unavoidable.",
    ],
    faqs: [],
    related: ["mutual-funds", "equity-shares", "goal-based-planning"],
  },
};