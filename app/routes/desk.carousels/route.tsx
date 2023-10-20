import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { Edit, MoreVertical } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { Separator } from "~/components/ui/separator";
import { getAllCarousels } from "~/dao/carousels.server";
import { requireUserId } from "~/lib/session.server";
import { cn } from "~/lib/utils";
import { CarouselListItem } from "./carousel-list-item";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const _carouselsQuery = await getAllCarousels();

  if (_carouselsQuery.ok) return json({ carousels: _carouselsQuery.carousels });

  return json({ userId, carousels: [] });
};

export default function CarouselsLayout() {
  const location = useLocation();
  const hideParent = location.pathname !== "/desk/carousels";
  const { carousels } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full overflow-hidden">
      <div
        className={cn("w-full flex-col border-r md:flex md:w-72", {
          hidden: hideParent,
        })}
      >
        <div className="flex items-center justify-between p-2">
          <p className="font-outfit font-medium">Carousels</p>
          <div className="flex items-center">
            <Link to="new">
              <ActionButton icon={Edit} tooltip="Add carousel" />
            </Link>
            <ActionButton icon={MoreVertical} tooltip="Show menu" />
          </div>
        </div>
        <Separator />
        {carousels.length > 0 ? (
          <div className="flex-1 space-y-1 overflow-y-auto">
            {carousels.map((carousel) => (
              <CarouselListItem
                key={carousel._id.toString()}
                name={carousel.name}
                to={carousel._id.toString()}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex justify-center items-center p-2">
            <p>No carousels found</p>
          </div>
        )}
      </div>
      <div className="h-full w-full flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export const ErrorBoundary = () => <ErrorBoundaryComponent />;
