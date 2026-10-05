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

/** "78,5 Mrd.", "1,49 Mrd.", "703,9 Mio.", for figures too long to read digit by digit */
export function formatCompact(value: number, maximumFractionDigits = 1): string {
  const abs = Math.abs(value)
  if (abs >= 1e12) return `${formatNumber(value / 1e12, maximumFractionDigits)} Billionen`
  if (abs >= 1e9) return `${formatNumber(value / 1e9, maximumFractionDigits)} Mrd.`
  if (abs >= 1e6) return `${formatNumber(value / 1e6, maximumFractionDigits)} Mio.`
  return formatNumber(value)
}
