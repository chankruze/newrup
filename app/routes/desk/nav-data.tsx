import { Home, Mailbox, Quote, Settings, Text } from "lucide-react";
import type { BottomNavItemProps } from "./bottom-nav-item";
import type { NavItemProps } from "./nav-item";

type NavLinkType = NavItemProps & BottomNavItemProps;

export const navLinks: NavLinkType[] = [
  {
    to: "dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    to: "sections",
    label: "Sections",
    icon: Text,
  },
  {
    to: "testimonials",
    label: "Testimonials",
    icon: Quote,
  },
  {
    to: "mailbox",
    label: "Mailbox",
    icon: Mailbox,
  },
  {
    to: "settings",
    label: "Settings",
    icon: Settings,
  },
];
