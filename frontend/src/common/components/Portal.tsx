import React from "react";
import ReactDOM from "react-dom";

export function Portal({ children }: React.PropsWithChildren<{}>) {
  const node = document.querySelector("body");
  return ReactDOM.createPortal(children, node as HTMLBodyElement);
}
