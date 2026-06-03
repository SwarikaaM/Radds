// src/utils/financialProfile.js

export const DEFAULT_PROFILE = Object.freeze({
  personal: {
    name: "",
    email: "",
    phone: "",
    age: "",
    children: 0,
  },

  children: [],

  income: {
    salary: 0,
    businessIncome: 0,
    rentalIncome: 0,
    investmentIncome: 0,
    otherIncome: 0,
  },

  expenses: {
    rent: 0,
    maintenance: 0,

    electricity: 0,
    water: 0,
    internet: 0,

    groceries: 0,

    transport: 0,
    fuel: 0,

    medical: 0,

    lifeInsurance: 0,
    healthInsurance: 0,
    vehicleInsurance: 0,

    entertainment: 0,
    travel: 0,

    other: 0,
},
});

const STORAGE_KEY =
  "radds_financial_profile";

function deepClone(obj) {
  return JSON.parse(
    JSON.stringify(obj)
  );
}

export function createEmptyProfile() {
  return deepClone(DEFAULT_PROFILE);
}

export function getProfile() {
  try {
    const stored =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!stored) {
      return createEmptyProfile();
    }

    const parsed =
      JSON.parse(stored);

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {
      return createEmptyProfile();
    }

    return {
      personal: {
        ...DEFAULT_PROFILE.personal,
        ...(parsed.personal || {}),
      },

      income: {
        ...DEFAULT_PROFILE.income,
        ...(parsed.income || {}),
      },

      expenses: {
        ...DEFAULT_PROFILE.expenses,
        ...(parsed.expenses || {}),
      },

      children: parsed.children || [],
    };
  } catch (error) {
    console.error(
      "Failed to load financial profile:",
      error
    );

    return createEmptyProfile();
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(profile)
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to save financial profile:",
      error
    );

    return false;
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(
      STORAGE_KEY
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to clear profile:",
      error
    );

    return false;
  }
}

function safeNumber(value) {
  const number = Number(value);

  if (
    Number.isNaN(number) ||
    !Number.isFinite(number)
  ) {
    return 0;
  }

  return Math.max(0, number);
}

export function calculateTotals(profile) {
  const totalIncome =
    Object.values(
      profile?.income || {}
    ).reduce(
      (sum, value) =>
        sum + safeNumber(value),
      0
    );

  const totalExpenses =
    Object.values(
      profile?.expenses || {}
    ).reduce(
      (sum, value) =>
        sum + safeNumber(value),
      0
    );

  const childExpenses =
    (profile?.children || []).reduce(
      (total, child) => {
        return (
          total +
          safeNumber(child.education) +
          safeNumber(child.allowance) +
          safeNumber(child.holiday) +
          safeNumber(child.medical)
        );
      },
      0
    );

  const grandExpenses =
    totalExpenses + childExpenses;

  const investmentCapacity =
    totalIncome - grandExpenses;

  return {
    totalIncome,

    totalExpenses:
      grandExpenses,

    baseExpenses:
      totalExpenses,

    childExpenses,

    investmentCapacity:
      investmentCapacity > 0
        ? investmentCapacity
        : 0,

    deficit:
      investmentCapacity < 0
        ? Math.abs(
            investmentCapacity
          )
        : 0,
  };
}