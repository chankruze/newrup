import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { MoreVertical, Save, Trash, X } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { SITE_TITLE } from "~/consts";
import { getSection } from "~/dao/sections.server";
import { cn } from "~/lib/utils";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (id) {
    const { ok, section } = await getSection(id);

    if (ok) return json({ section });

    return json({ section: null });
  }

  return json({ section: null });
};

export type SectionLoader = typeof loader;

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.section?.title} / ${SITE_TITLE}` },
    {
      property: "og:title",
      content: `${data?.section?.title} / ${SITE_TITLE}`,
    },
    { name: "description", content: `${data?.section?.subtitle}` },
  ];
};

export default function ProductPage() {
  const { section } = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  const back = () => navigate("/desk/sections");

  if (section) {
    const lastUpdated = new Date(section.dateUpdated);

    return (
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="space-y-1 border-b p-2">
          <div className="flex items-center justify-between">
            <p className="font-outfit font-medium">{section.title}</p>
            <div className="flex items-center">
              <ActionButton tooltip="Show menu" icon={MoreVertical} />
              <ActionButton tooltip="close" icon={X} action={back} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center">
              <NavLink
                to="edit"
                className={({ isActive, isPending }) =>
                  cn("rounded px-2 py-1 text-sm", {
                    "bg-primary text-primary-foreground": isActive,
                    "hover:bg-accent": !isActive,
                    "bg-red-400/10 text-red-400": isPending,
                  })
                }
                end
              >
                Editor
              </NavLink>
              <NavLink
                to="preview"
                className={({ isActive, isPending }) =>
                  cn("rounded px-2 py-1 text-sm", {
                    "bg-primary text-primary-foreground": isActive,
                    "hover:bg-accent": !isActive,
                    "bg-red-400/10 text-red-400": isPending,
                  })
                }
                end
              >
                Preview
              </NavLink>
            </div>
            <div className="text-sm">
              {lastUpdated.toLocaleDateString()}{" "}
              {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
        <div className="flex items-center justify-between border-t p-2">
          <div></div>
          <div className="flex items-center">
            <ActionButton tooltip="Save changes" icon={Save} />
            <ActionButton tooltip="Delete" icon={Trash} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2">
      <p>Section not found!</p>
    </div>
  );
}
