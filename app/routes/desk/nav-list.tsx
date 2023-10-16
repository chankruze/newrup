import { navLinks } from "./nav-data";
import { NavItem } from "./nav-item";

export const NavList = () => {
  return (
    <ul className="space-y-1">
      {navLinks.map((link) => (
        <NavItem key={`nav-${link.to}`} {...link} />
      ))}
    </ul>
  );
};
