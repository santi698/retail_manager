const currencyFormatter = new Intl.NumberFormat(navigator.language, {
  currency: "ARS",
  style: "currency",
});

export function Currency({ children }: { children: number }) {
  return <>{currencyFormatter.format(children)}</>;
}

export function formatCurrency(number: number) {
  return currencyFormatter.format(number);
}
