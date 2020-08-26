import React, { SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  label: string;
}

export function Select({ children, label, ...rest }: SelectProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "12em" }}>
      <label htmlFor={rest.id}>{label}</label>
      <select {...rest}>{children}</select>
    </div>
  );
}
