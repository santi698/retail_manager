import React from "react";

export enum ColorVariant {
  Purple,
}

export function StatusBadge({
  colorVariant,
  children,
}: {
  colorVariant: ColorVariant;
  children: React.ReactNode;
}) {
  return <div className="badge">{children}</div>;
}
