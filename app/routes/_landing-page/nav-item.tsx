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
        className={({ isActive }) =>
          cn(
            "hover-underline-animation duration-250 font-outfit text-xl font-medium",
            {
              underline: isActive,
            },
          )
        }
        end
      >
        {label}
      </NavLink>
    </li>
  );
};
