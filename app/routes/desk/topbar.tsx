import { AppWindow } from "lucide-react";
import { ThemeToggle } from "~/components/theme-toggle";
import { SITE_TITLE } from "~/consts";

export const Topbar = () => {
  return (
    <header className="supports-backdrop-blur:bg-background/60 w-full border-b bg-background/95 backdrop-blur">
      <div className="grid h-14 grid-cols-3 px-4">
        <div className="flex items-center gap-2">
          <img src="/favicon.ico" alt="" className="h-6 w-6" />
          <p className="hidden font-outfit text-lg font-medium sm:block">
            {SITE_TITLE}
          </p>
        </div>
        <div className="flex items-center justify-center gap-1">
          <AppWindow className="h-6 w-6" />
          <p className="font-outfit font-medium">Desk</p>
        </div>
        <div className="flex items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
