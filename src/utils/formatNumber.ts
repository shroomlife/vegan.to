const formatter = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 })

export function formatNumber(value: number): string {
  return formatter.format(Math.round(value))
}
