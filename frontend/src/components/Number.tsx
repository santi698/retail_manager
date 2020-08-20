import React from "react";

const numberFormatter = new Intl.NumberFormat(navigator.language, {
  style: "decimal",
});

export function Number({ children }: { children: number }) {
  return <>{numberFormatter.format(children)}</>;
}
