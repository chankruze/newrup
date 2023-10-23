import { Link, NavLink } from "@remix-run/react";
import clsx from "clsx";
import { Menu } from "lucide-react";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { SITE_TITLE, SITE_TITLE_SHORT } from "~/consts";
import { navLinks } from "./nav-data";

export const Navbar = () => {
  return (
    <div className="px-[5vw] py-9 lg:py-12">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        {/* brand */}
        <Link
          className="hover-underline-animation block whitespace-nowrap font-outfit text-2xl 
          font-bold text-primary focus:outline-none lg:text-3xl"
          to="/"
        >
          <h1 className="hidden sm:block">{SITE_TITLE}</h1>
          <h1 className="sm:hidden">{SITE_TITLE_SHORT}</h1>
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
          <Sheet>
            <SheetTrigger>
              <Button size="icon" variant="ghost" className="md:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent></SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
