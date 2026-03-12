export function formatCurrency(
  value: number,
  locale = 'pt-BR',
  currency = 'BRL',
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

export function formatDate(value: string, locale = 'pt-BR') {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}
