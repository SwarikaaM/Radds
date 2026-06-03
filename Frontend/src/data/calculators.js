export const calculators = [
  {
    id: "sip",
    slug: "sip",
    title: "SIP Calculator",

    // Legacy support
    description: "Find out how much your monthly SIP can grow over time.",

    // New overview page
    shortDescription:
      "Find out how much your monthly SIP can grow into over time with the power of compounding.",

    icon: "TrendingUp",
    category: "SIP Planning",
    route: "/calculators/sip",
    inputsSummary: "Monthly amount · Annual return · Duration",
    bestFor: "First-time investors building a habit",
  },

  {
    id: "swp",
    slug: "swp",
    title: "SWP Calculator",

    description:
      "Plan regular withdrawals from your mutual fund corpus.",

    shortDescription:
      "Plan regular monthly withdrawals from a corpus while letting the remaining balance keep growing.",

    icon: "ArrowDownCircle",
    category: "Withdrawals",
    route: "/calculators/swp",
    inputsSummary:
      "Corpus · Monthly withdrawal · Return · Duration",
    bestFor: "Retirees seeking steady monthly income",
  },

  {
    id: "cost-of-delay-sip",
    slug: "cost-of-delay-sip",
    title: "Cost of Delay SIP",

    description:
      "See how starting late impacts your wealth journey.",

    shortDescription:
      "See exactly how much wealth you lose by delaying your SIP — even by just a few years.",

    icon: "Clock",
    category: "Goal Planning",
    route: "/calculators/cost-of-delay-sip",
    inputsSummary:
      "Monthly SIP · Return · Horizon · Delay years",
    bestFor: "Anyone still waiting for the right time",
  },

  {
    id: "lumpsum",
    slug: "lumpsum",
    title: "Lumpsum Calculator",

    description:
      "Calculate returns on one-time investments at different rates.",

    shortDescription:
      "Calculate the future value of a one-time investment at different return rates and horizons.",

    icon: "DollarSign",
    category: "Lumpsum",
    route: "/calculators/lumpsum",
    inputsSummary:
      "Investment amount · Annual return · Duration",
    bestFor: "Investing a bonus, inheritance, or windfall",
  },

  {
    id: "step-up-sip",
    slug: "step-up-sip",
    title: "Step-up SIP Calculator",

    description:
      "Model wealth growth when you increase your SIP annually.",

    shortDescription:
      "Model wealth growth when you increase your SIP amount annually, matching salary increments.",

    icon: "ArrowUpRight",
    category: "SIP Planning",
    route: "/calculators/step-up-sip",
    inputsSummary:
      "Starting SIP · Return · Duration · Annual Step-up %",
    bestFor: "Salaried professionals expecting yearly raises",
  },

  {
    id: "one-time-investment",
    slug: "one-time-investment",
    title: "One Time Investment",

    description:
      "Estimate the future value of a single large investment.",

    shortDescription:
      "Estimate the future value of a single large investment with compounding over your chosen horizon.",

    icon: "Zap",
    category: "Lumpsum",
    route: "/calculators/one-time-investment",
    inputsSummary:
      "Investment amount · Annual return · Duration",
    bestFor:
      "Planning a single strategic deployment of capital",
  },
];

export const calculatorCategories = [
  "All",
  "SIP Planning",
  "Withdrawals",
  "Lumpsum",
  "Goal Planning",
];


// 


// export const calculators = [
//   {
//     id: "sip",
//     title: "SIP Calculator",
//     description: "Find out how much your monthly SIP can grow over time.",
//     icon: "TrendingUp",
//     slug: "sip",
//   },
//   {
//     id: "swp",
//     title: "SWP Calculator",
//     description: "Plan regular withdrawals from your mutual fund corpus.",
//     icon: "ArrowDownCircle",
//     slug: "swp",
//   },
//   {
//     id: "cost-of-delay",
//     title: "Cost of Delay SIP",
//     description: "See how starting late impacts your wealth journey.",
//     icon: "Clock",
//     slug: "cost-of-delay",
//   },
//   {
//     id: "lumpsum",
//     title: "Lumpsum Calculator",
//     description: "Calculate returns on one-time investments at different rates.",
//     icon: "DollarSign",
//     slug: "lumpsum",
//   },
//   {
//     id: "stepup-sip",
//     title: "Step-up SIP Calculator",
//     description: "Model wealth growth when you increase your SIP annually.",
//     icon: "ArrowUpRight",
//     slug: "stepup-sip",
//   },
//   {
//     id: "one-time",
//     title: "One Time Investment",
//     description: "Estimate the future value of a single large investment.",
//     icon: "Zap",
//     slug: "one-time",
//   },
// ];
