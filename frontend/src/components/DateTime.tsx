import React from "react";

export const formatter = new Intl.DateTimeFormat(navigator.language, {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

export function DateTime({ children }: { children: Date }) {
  return <>{formatter.format(children)}</>;
}
