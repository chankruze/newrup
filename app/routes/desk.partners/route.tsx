import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { Edit, MoreVertical } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { Separator } from "~/components/ui/separator";
import { getAllPartners } from "~/dao/partners.server";
import { requireUserId } from "~/lib/session.server";
import { cn } from "~/lib/utils";
import { PartnerListItem } from "./partner-list-item";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const { partners } = await getAllPartners();

  if (partners) return json({ partners });

  return json({ userId, partners: [] });
};

export default function PartnersLayout() {
  const location = useLocation();
  const hideParent = location.pathname !== "/desk/partners";
  const { partners } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full overflow-hidden">
      <div
        className={cn("flex w-full flex-col border-r md:w-72", {
          "hidden md:flex": hideParent,
        })}
      >
        <div className="flex items-center justify-between p-2">
          <p className="font-outfit font-medium">Partners</p>
          <div className="flex items-center">
            <Link to="new">
              <ActionButton icon={Edit} tooltip="Add partner" />
            </Link>
            <ActionButton icon={MoreVertical} tooltip="Show menu" />
          </div>
        </div>
        <Separator />
        {partners.length > 0 ? (
          <div className="flex-1 space-y-1 overflow-y-auto">
            {partners.map((partner) => (
              <PartnerListItem
                key={partner._id.toString()}
                name={partner.name}
                to={partner._id.toString()}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-2">
            <p>No partners found</p>
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
