import { NavLink } from "@remix-run/react";
import { cn } from "~/lib/utils";

type NavItemProps = {
  to: string;
  label: string;
};

export const NavItem = ({ to, label }: NavItemProps) => {
  return (
    <li className="flex">
      <NavLink
        to={to}
        className={({ isActive, isPending }) =>
          cn(
            "flex flex-1 font-medium items-center justify-between p-2 font-outfit transition-all duration-300",
            {
              "text-blue-500": isActive,
              "hover:opacity-80": !isActive,
              "text-red-400": isPending,
            }
          )
        }
      >
        {label}
      </NavLink>
    </li>
  );
};
