import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Map,
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
  // {
  //   name: "GitHub",
  //   url: "https://github.com/chankruze",
  //   icon: Github,
  // },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/chankruze/",
    icon: Linkedin,
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@geekofia",
    icon: Youtube,
  },
  {
    name: "Instagram",
    url: "https://instagram.com/chankruze",
    icon: Instagram,
  },
  {
    name: "Twitter",
    url: "https://twitter.com/chankruze",
    icon: Twitter,
  },
  {
    name: "Facebook",
    url: "https://facebook.com/chankruze",
    icon: Facebook,
  },
];

export const contactDetails = [
  {
    name: "Email",
    href: `mailto:chankruze@gmail.com`,
    icon: Mail,
    value: ["chankruze@gmail.com"],
  },
  {
    name: "Phone",
    href: `tel:+91-8144356767`,
    icon: Phone,
    value: ["+91-8144356767", "+91-8144356767"],
  },
  {
    name: "Text",
    href: `https://wa.me/918144356767`,
    icon: MessageCircle,
    value: ["+91-8144356767"],
  },
  {
    name: "Address",
    href: "https://goo.gl/maps/1Q5Z1J8Z1Z9Z2JZr9",
    icon: Map,
    value: ["OUTR, Ghatikia, Bhubaneswar, Odisha, 751002"],
  },
];
