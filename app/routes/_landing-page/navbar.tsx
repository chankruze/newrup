import { Link } from "@remix-run/react";
import { Menu } from "lucide-react";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { SITE_TITLE } from "~/consts";
import { NavList } from "./nav-links";

export const Navbar = () => {
  return (
    <div className="bg-navbar/90 fixed left-0 right-0 top-0 z-40 w-full shadow-lg backdrop-blur text-navbar-foreground px-4">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        {/* brand */}
        <Link
          className="hover-underline-animation block whitespace-nowrap font-outfit text-2xl 
          font-bold focus:outline-none lg:text-3xl"
          to="/"
        >
          <img src="/logo.png" alt={SITE_TITLE} className="h-16" />
        </Link>
        {/* nav links */}
        <nav className="hidden flex-1 items-center justify-center md:flex">
          <NavList />
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
