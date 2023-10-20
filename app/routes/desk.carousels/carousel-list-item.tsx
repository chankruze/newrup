import { NavLink } from "@remix-run/react";
import { Loader } from "lucide-react";
import { cn } from "~/lib/utils";

type CarouselListItemProps = {
  to: string;
  name: string;
};

export const CarouselListItem = ({ to, name }: CarouselListItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive, isPending }) =>
        cn(
          "line-clamp-1 flex flex-1 items-center justify-between gap-3 px-4 py-3 font-outfit transition-all duration-300",
          {
            "bg-primary text-primary-foreground": isActive,
            "hover:bg-accent": !isActive,
            "bg-red-400/10 text-red-400": isPending,
          }
        )
      }
    >
      {({ isPending }) => (
        <>
          <div className="flex items-center gap-3">
            <span className="line-clamp-1">{name}</span>
          </div>
          {isPending ? (
            <div>
              <span>
                <Loader />
              </span>
            </div>
          ) : null}
        </>
      )}
    </NavLink>
  );
};