import type { CurrencyCode } from "./currencies";

// Frankfurter API conversion using daily ECB rates
// Docs: https://www.frankfurter.app/docs/
export async function convert(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
) {
  const url = new URL("https://api.frankfurter.app/latest");
  url.searchParams.set("amount", String(amount));
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Frankfurter error: ${res.status}`);
  }
  const data: { amount: number; base: string; rates: Record<string, number> } =
    await res.json();
  const total = data.rates[to];
  if (typeof total !== "number") {
    throw new Error("Target currency not in response");
  }
  const rate = total / amount;
  return { rate, total };
}
