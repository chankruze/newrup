import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import { MoreVertical, X } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { SITE_TITLE } from "~/consts";
import { getTestimony } from "~/dao/testimonials.server";
import { cn } from "~/lib/utils";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (id) {
    const { testimony } = await getTestimony(id);

    if (testimony) return json({ testimony });

    return json({ testimony: null });
  }

  return json({ testimony: null });
};

export type TestimonyLoader = typeof loader;

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.testimony?.name} / ${SITE_TITLE}` },
    {
      property: "og:title",
      content: `${data?.testimony?.name} / ${SITE_TITLE}`,
    },
    { name: "description", content: `${data?.testimony?.content}` },
  ];
};

export default function TestimonyPage() {
  const { testimony } = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  const back = () => navigate("/desk/testimonials");

  if (testimony) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="space-y-1 border-b p-2">
          <div className="flex items-center justify-between">
            <p className="font-outfit font-medium line-clamp-1">
              {testimony.name}'s Testimony
            </p>
            <div className="flex items-center">
              <ActionButton tooltip="Show menu" icon={MoreVertical} />
              <ActionButton tooltip="close" icon={X} action={back} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
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
            <div className="text-sm font-medium">
              {format(new Date(testimony.updatedAt), "dd-MM-yyyy hh:mm a")}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2 grid place-content-center">
      <p>Testimony not found!</p>
    </div>
  );
}
