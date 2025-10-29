import type { CurrencyCode } from './currencies';

export const USD_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.8,
  NPR: 118.16,
  INR: 83.1,
  JPY: 151.2,
  AUD: 1.53,
  CAD: 1.37
};

export function getRate(from: CurrencyCode, to: CurrencyCode): number {
  const rateToUSD = 1 / USD_RATES[from];
  return rateToUSD * USD_RATES[to];
}

export function convert(amount: number, from: CurrencyCode, to: CurrencyCode) {
  const rate = getRate(from, to);
  return { rate, total: amount * rate };
}

