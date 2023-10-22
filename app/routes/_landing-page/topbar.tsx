import { Link } from "@remix-run/react";
import { Menu } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SITE_TITLE } from "~/consts";
import { NavList } from "./nav-links";

export const Topbar = () => {
  return (
    <header className="supports-backdrop-blur:bg-background/60 w-full border-b bg-background/95 backdrop-blur">
      <div className="h-14 flex container items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/favicon.ico" alt="" className="h-8 w-8" />
          <p className="hidden font-outfit text-lg font-bold sm:block">
            {SITE_TITLE}
          </p>
        </Link>
        <div className="hidden sm:flex items-center justify-end">
          <NavList />
        </div>
        <div className="sm:hidden flex items-center justify-end">
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        </div>
      </div>
    </header>
  );
};
