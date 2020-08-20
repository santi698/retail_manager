import React from "react";

const formatter = new Intl.NumberFormat(navigator.language, {
  style: "percent",
});

export function Percentage({ children }: { children: number }) {
  return <>{formatter.format(children)}</>;
}
