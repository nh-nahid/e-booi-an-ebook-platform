// Formats a number using Bengali (bn-BD) digits/grouping, matching how
// numerals are shown everywhere else on the storefront (prices, dates, ...).
export function bn(value: number | string): string {
  const num = typeof value === "string" ? Number(value) : value;

  if (Number.isNaN(num)) return String(value);

  return num.toLocaleString("bn-BD");
}
