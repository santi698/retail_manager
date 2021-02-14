import React from "react";

const formatter = new Intl.NumberFormat(navigator.language, {
  style: "percent",
  minimumFractionDigits: 2,
});

export function Percentage({ children }: { children: number }) {
  return <>{formatter.format(children)}</>;
}
