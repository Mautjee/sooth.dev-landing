// Small date helper shared across layouts/pages.
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatPeriod(period: string): string {
  return period;
}
