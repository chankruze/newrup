import { NavLink } from "@remix-run/react";
import { SocialLink } from "~/components/social-links";
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  contactDetails,
  socialLinks,
} from "~/consts";
import { cn } from "~/lib/utils";
import { navLinks } from "./nav-data";

export const Footer = () => {
  return (
    <footer className="border-t px-[5vw] py-9 lg:py-16">
      <div className="max-w-8xl mx-auto grid grid-cols-2 gap-12 md:grid-cols-4 xl:grid-cols-8">
        <div className="col-span-2 space-y-6 md:col-span-4">
          <h1 className="text-title font-outfit text-2xl font-bold md:text-4xl">
            {SITE_TITLE}
          </h1>
          <p className="text-subtitle max-w-md font-outfit text-xl">
            {SITE_DESCRIPTION}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
            {socialLinks.slice(0, 6).map((link) => (
              <SocialLink key={link.name} {...link} />
            ))}
          </div>
        </div>

        <div className="space-y-6 md:col-start-7">
          <h1 className="text-title font-outfit text-xl font-medium">
            Reach Us
          </h1>
          <ul className="space-y-4">
            {contactDetails.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.url}
                  className="hover-underline-animation font-outfit text-lg text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white sm:text-xl"
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6 md:col-start-8">
          <h1 className="text-title font-outfit text-xl font-medium">Links</h1>
          <ul className="space-y-4">
            {navLinks.map((link, idx) => (
              <li key={idx}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "hover-underline-animation font-outfit text-lg hover:text-zinc-950 dark:hover:text-white sm:text-xl",
                      {
                        "text-zinc-950 dark:text-white": isActive,
                        "text-zinc-500 dark:text-zinc-400": !isActive,
                      },
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
