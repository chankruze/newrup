import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { Edit, MoreVertical } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { Separator } from "~/components/ui/separator";
import { getAllSections } from "~/dao/sections.server";
import { requireUserId } from "~/lib/session.server";
import { cn } from "~/lib/utils";
import { SectionListItem } from "./section-list-item";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const _sectionsQuery = await getAllSections();

  if (_sectionsQuery.ok) return json({ sections: _sectionsQuery.sections });

  return json({ userId, sections: [] });
};

export default function SectionsLayout() {
  const location = useLocation();
  const hideParent = location.pathname !== "/desk/sections";
  const { sections } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full overflow-hidden">
      <div
        className={cn("w-full flex-col border-r md:flex md:w-72", {
          hidden: hideParent,
        })}
      >
        <div className="flex items-center justify-between p-2">
          <p className="font-outfit font-medium">Sections</p>
          <div className="flex items-center">
            <Link to="new">
              <ActionButton icon={Edit} tooltip="Add section" />
            </Link>
            <ActionButton icon={MoreVertical} tooltip="Show menu" />
          </div>
        </div>
        <Separator />
        {sections.length > 0 ? (
          <div className="flex-1 space-y-1 overflow-y-auto">
            {sections.map((section) => (
              <SectionListItem
                key={section._id.toString()}
                title={section.name}
                to={section._id.toString()}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex justify-center items-center p-2">
            <p>No sections found</p>
          </div>
        )}
      </div>
      <div className="h-full w-full flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
