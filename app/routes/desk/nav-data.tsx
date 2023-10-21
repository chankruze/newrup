import {
  Award,
  Building2,
  Image,
  Mailbox,
  Quote,
  Settings,
  ShoppingBag,
  Text,
  Users,
} from "lucide-react";
import type { BottomNavItemProps } from "./bottom-nav-item";
import type { NavItemProps } from "./nav-item";

type NavLinkType = NavItemProps & BottomNavItemProps;

export const navLinks: NavLinkType[] = [
  {
    to: "sections",
    label: "Sections",
    icon: Text,
  },
  {
    to: "partners",
    label: "Partners",
    icon: Building2,
  },
  {
    to: "products",
    label: "Products",
    icon: ShoppingBag,
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
    to: "users",
    label: "Users",
    icon: Users,
  },
  {
    to: "settings",
    label: "Settings",
    icon: Settings,
  },
];
