import { NavLink } from "@remix-run/react";
import { cn } from "~/lib/utils";

type Props = {
  to: string;
  label: string;
};

export const ActionTabButton = ({ to, label }: Props) => {
  return (
    <NavLink
      to={to}
      className={({ isActive, isPending }) =>
        cn("px-2 py-1 text-sm", {
          "bg-primary text-primary-foreground": isActive,
          "hover:bg-accent": !isActive,
          "bg-red-400/10 text-red-400": isPending,
        })
      }
      end
    >
      {label}
    </NavLink>
  );
};
