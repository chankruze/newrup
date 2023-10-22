import { Link, NavLink } from "@remix-run/react";
import clsx from "clsx";
import { useState } from "react";
import { ThemeToggle } from "~/components/theme-toggle";
import { SITE_TITLE } from "~/consts";
import { navLinks } from "./nav-data";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="px-[5vw] py-9 lg:py-12">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        {/* brand */}
        <Link
          className="hover-underline-animation block whitespace-nowrap font-outfit text-2xl 
          font-medium text-primary focus:outline-none lg:text-3xl"
          to="/"
        >
          <h1>{SITE_TITLE}</h1>
        </Link>
        {/* nav links */}
        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  "hover-underline-animation duration-250 font-outfit text-xl hover:text-zinc-950 dark:hover:text-white",
                  {
                    "text-zinc-950 dark:text-white": isActive,
                    "text-zinc-400": !isActive,
                  },
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {/* theme toggle */}
          <ThemeToggle />
          {/* menu toggle */}
          {/* <button
            className="relative inline-flex items-center justify-center rounded-full p-2 transition md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <div className="animate-spin-super-slow-reverse hover:animate-spin-slow absolute m-auto">
              <svg className="h-12 w-12" viewBox="0 0 56 56">
                <path
                  d="M29.465,0.038373A28,28,0,0,1,52.948,40.712L51.166,39.804A26,26,0,0,0,29.361,2.0356Z"
                  className="text-yellow-500"
                  fill="currentColor"
                ></path>
                <path
                  d="M51.483,43.250A28,28,0,0,1,4.5172,43.250L6.1946,42.161A26,26,0,0,0,49.805,42.161Z"
                  className="text-blue-500"
                  fill="currentColor"
                ></path>
                <path
                  d="M3.0518,40.712A28,28,0,0,1,26.535,0.038373L26.639,2.0356A26,26,0,0,0,4.8338,39.804Z"
                  className="text-red-500"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </button> */}
        </div>
      </div>
    </div>
  );
};
