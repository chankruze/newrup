import {
  Award,
  Home,
  Image,
  Info,
  Mailbox,
  Quote,
  Settings,
  Text,
} from "lucide-react";
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
    to: "carousels",
    label: "Carousels",
    icon: Image,
  },
  {
    to: "contact-details",
    label: "Contact Details",
    icon: Info,
  },
  {
    to: "certifications",
    label: "Certifications",
    icon: Award,
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
