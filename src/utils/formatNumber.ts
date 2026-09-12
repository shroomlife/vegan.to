const formatters = new Map<number, Intl.NumberFormat>()

/** de-DE number formatting; rounds to `maximumFractionDigits` (default 0) */
export function formatNumber(value: number, maximumFractionDigits = 0): string {
  let formatter = formatters.get(maximumFractionDigits)
  if (!formatter) {
    formatter = new Intl.NumberFormat('de-DE', { maximumFractionDigits })
    formatters.set(maximumFractionDigits, formatter)
  }
  return formatter.format(value)
}
