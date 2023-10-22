import { NavListItem } from "~/components/nav-list-item";
import { navLinks } from "./nav-data";

export const NavList = () => {
  return (
    <ul className="space-y-1">
      {navLinks.map((link) => (
        <NavListItem key={`nav-${link.to}`} {...link} />
      ))}
    </ul>
  );
};
