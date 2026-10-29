// Exact non-negative rational cents, rounded half-up only at concept boundaries.
export interface Fraction { n: bigint; d: bigint }
export const fraction = (n: bigint, d = 1n): Fraction => ({ n, d });
export const multiply = (a: Fraction, b: Fraction): Fraction => ({ n: a.n * b.n, d: a.d * b.d });
export const add = (a: Fraction, b: Fraction): Fraction => ({ n: a.n * b.d + b.n * a.d, d: a.d * b.d });
export function roundHalfUp(value: Fraction): bigint {
  if (value.n < 0n || value.d <= 0n) throw new Error("Only non-negative monetary values are supported");
  return (2n * value.n + value.d) / (2n * value.d);
}
export function positiveCents(raw: string): bigint | null {
  const text = raw.trim();
  // One explicit decimal separator, at most two decimals; never infer grouping.
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(text)) return null;
  const [whole, decimals = ""] = text.split(/[.,]/);
  const cents = BigInt(whole) * 100n + BigInt(decimals.padEnd(2, "0"));
  return cents > 0n ? cents : null;
}
export function positiveInteger(raw: string): bigint | null {
  if (!/^\d+$/.test(raw.trim())) return null;
  const value = BigInt(raw.trim());
  return value > 0n ? value : null;
}
export function taxRate(raw: string | null): Fraction | null {
  if (raw === null || !/^\d+(?:\.\d+)?$/.test(raw)) return null;
  const [whole, decimals = ""] = raw.split(".");
  const denominator = 10n ** BigInt(decimals.length);
  const numerator = BigInt(whole) * denominator + BigInt(decimals || "0");
  return numerator <= denominator ? fraction(numerator, denominator) : null;
}
export function formatCents(raw: string): string {
  const cents = BigInt(raw);
  const digits = (cents / 100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `S/ ${digits}.${(cents % 100n).toString().padStart(2, "0")}`;
}
