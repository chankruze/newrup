import {
  Award,
  Building2,
  Image,
  Mailbox,
  Milestone,
  Quote,
  Settings,
  ShoppingBag,
  Text,
  Users,
} from "lucide-react";
import type { BottomNavItemProps } from "./bottom-nav-item";

type NavLinkType = {
  to: string;
  label: string;
  priority: number;
} & BottomNavItemProps;

export const navLinks: NavLinkType[] = [
  {
    to: "sections",
    label: "Sections",
    icon: Text,
    priority: 1,
  },
  {
    to: "partners",
    label: "Partners",
    icon: Building2,
    priority: 2,
  },
  {
    to: "products",
    label: "Products",
    icon: ShoppingBag,
    priority: 3,
  },
  {
    to: "testimonials",
    label: "Testimonials",
    icon: Quote,
    priority: 4,
  },
  {
    to: "carousels",
    label: "Carousels",
    icon: Image,
    priority: 5,
  },
  {
    to: "certifications",
    label: "Certifications",
    icon: Award,
    priority: 6,
  },
  {
    to: "milestones",
    label: "Milestones",
    icon: Milestone,
    priority: 7,
  },
  {
    to: "mailbox",
    label: "Mailbox",
    icon: Mailbox,
    priority: 8,
  },
  {
    to: "users",
    label: "Users",
    icon: Users,
    priority: 9,
  },
  {
    to: "settings",
    label: "Settings",
    icon: Settings,
    priority: 10,
  },
];
