import {
  Mail,
  Map,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";

export const SITE_TITLE = `Newrup Tech Solutions`;
export const SITE_TITLE_SHORT = `NTS`;
export const SITE_DESCRIPTION = `Newrup Tech Solutions is a tech-driven company committed to innovating and simplifying lifestyles in rural areas.`;

export type SocialLinkType = {
  name: string;
  url: string;
  icon: LucideIcon;
};

export const socialLinks: SocialLinkType[] = [
  {
    name: "YouTube",
    url: "https://www.youtube.com/@NewrupTechSolutions",
    icon: Youtube,
  },
  {
    name: "Twitter",
    url: "https://twitter.com/NewrupTech",
    icon: Twitter,
  },
  {
    name: "Email",
    url: `mailto:newruptechsolutions@gmail.com`,
    icon: Mail,
  },
  {
    name: "Phone",
    url: `tel:+91-7991080926`,
    icon: Phone,
  },
  {
    name: "WhatsApp",
    url: `https://wa.me/+917991080926`,
    icon: MessageCircle,
  },
  {
    name: "Address",
    url: "https://goo.gl/maps/1Q5Z1J8Z1Z9Z2JZr9",
    icon: MapPin,
  },
];

export const contactDetails = [
  {
    name: "Email",
    url: `mailto:newruptechsolutions@gmail.com`,
    icon: Mail,
    value: ["newruptechsolutions@gmail.com"],
  },
  {
    name: "Phone",
    url: `tel:+91-7991080926`,
    icon: Phone,
    value: ["+91-7991080926", "+91-7978369574"],
  },
  {
    name: "WhatsApp",
    url: `https://wa.me/+917991080926`,
    icon: MessageCircle,
    value: ["+91-7991080926"],
  },
  {
    name: "Address",
    url: "https://goo.gl/maps/1Q5Z1J8Z1Z9Z2JZr9",
    icon: Map,
    value: ["OUTR, Ghatikia, Bhubaneswar, Odisha, 751002"],
  },
];
