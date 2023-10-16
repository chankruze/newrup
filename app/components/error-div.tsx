import type { ReactNode } from "react";

type ErrorDivProps = {
  children: ReactNode;
};

export const ErrorDiv = ({ children }: ErrorDivProps) => {
  return <p className="text-sm text-red-500 font-medium">{children}</p>;
};
