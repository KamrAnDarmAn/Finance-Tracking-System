import "reflect-metadata";
import "dotenv/config";
import { AppDataSource } from "@/data-source.ts";
import { db } from "@/lib/db.ts";

const accountTypes = [
  {
    name: "Checking",
    description: "Everyday spending account for deposits, withdrawals, and bill pay.",
  },
  {
    name: "Savings",
    description: "Interest-bearing account for emergency funds and short-term goals.",
  },
  {
    name: "Credit Card",
    description: "Revolving credit line for purchases paid back over time.",
  },
  {
    name: "Investment",
    description: "Brokerage or retirement account for stocks, bonds, and funds.",
  },
  {
    name: "Cash",
    description: "Physical cash or petty cash not held at a financial institution.",
  },
  {
    name: "Loan",
    description: "Personal, auto, mortgage, or other debt account.",
  },
];

const currencies = [
  { name: "US Dollar", code: "USD", symbol: "$" },
  { name: "Euro", code: "EUR", symbol: "€" },
  { name: "British Pound", code: "GBP", symbol: "£" },
  { name: "Japanese Yen", code: "JPY", symbol: "¥" },
  { name: "Canadian Dollar", code: "CAD", symbol: "CA$" },
  { name: "Australian Dollar", code: "AUD", symbol: "A$" },
  { name: "Swiss Franc", code: "CHF", symbol: "CHF" },
  { name: "Chinese Yuan", code: "CNY", symbol: "¥" },
  { name: "Indian Rupee", code: "INR", symbol: "₹" },
  { name: "UAE Dirham", code: "AED", symbol: "د.إ" },
];

const institutions = [
  {
    name: "Cash / No Institution",
    website: "",
    supportPhone: "",
  },
  {
    name: "Chase",
    website: "https://www.chase.com",
    supportPhone: "1-800-935-9935",
  },
  {
    name: "Bank of America",
    website: "https://www.bankofamerica.com",
    supportPhone: "1-800-432-1000",
  },
  {
    name: "Wells Fargo",
    website: "https://www.wellsfargo.com",
    supportPhone: "1-800-869-3557",
  },
  {
    name: "Citibank",
    website: "https://www.citi.com",
    supportPhone: "1-800-374-9700",
  },
  {
    name: "Capital One",
    website: "https://www.capitalone.com",
    supportPhone: "1-800-227-4825",
  },
  {
    name: "American Express",
    website: "https://www.americanexpress.com",
    supportPhone: "1-800-528-4800",
  },
  {
    name: "PayPal",
    website: "https://www.paypal.com",
    supportPhone: "1-888-221-1161",
  },
  {
    name: "Vanguard",
    website: "https://www.vanguard.com",
    supportPhone: "1-800-662-7447",
  },
  {
    name: "Fidelity",
    website: "https://www.fidelity.com",
    supportPhone: "1-800-343-3548",
  },
];

async function seedCollection<T extends { name: string }>(
  label: string,
  items: T[],
  findExisting: (item: T) => Promise<unknown>,
  create: (item: T) => Promise<unknown>,
) {
  let created = 0;

  for (const item of items) {
    const existing = await findExisting(item);
    if (existing) {
      continue;
    }

    await create(item);
    created += 1;
  }

  console.log(`${label}: ${created} created, ${items.length - created} skipped`);
}

async function seedReferenceData() {
  await AppDataSource.initialize();

  await seedCollection(
    "Account types",
    accountTypes,
    (item) => db.accountType.findOneBy({ name: item.name }),
    (item) =>
      db.accountType
        .create({ name: item.name, description: item.description })
        .save(),
  );

  await seedCollection(
    "Currencies",
    currencies,
    (item) => db.currency.findOneBy({ code: item.code }),
    (item) =>
      db.currency
        .create({ name: item.name, code: item.code, symbol: item.symbol })
        .save(),
  );

  await seedCollection(
    "Institutions",
    institutions,
    (item) => db.institution.findOneBy({ name: item.name }),
    (item) =>
      db.institution
        .create({
          name: item.name,
          website: item.website,
          supportPhone: item.supportPhone,
        })
        .save(),
  );

  await AppDataSource.destroy();
  console.log("Reference data seed completed.");
}

seedReferenceData().catch((error) => {
  console.error("Reference data seed failed:", error);
  process.exit(1);
});
