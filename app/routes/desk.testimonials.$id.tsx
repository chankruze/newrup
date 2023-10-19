import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { MoreVertical, X } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { SITE_TITLE } from "~/consts";
import { getTestimony } from "~/dao/testimonials.server";
import { cn } from "~/lib/utils";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (id) {
    const { ok, testimony } = await getTestimony(id);

    if (ok) return json({ testimony });

    return json({ testimony: null });
  }

  return json({ testimony: null });
};

export type SectionLoader = typeof loader;

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
    const lastUpdated = new Date(testimony.updatedAt);

    return (
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="space-y-1 border-b p-2">
          <div className="flex items-center justify-between">
            <p className="font-outfit font-medium">
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
            <div className="text-sm">
              {lastUpdated.toLocaleDateString()}{" "}
              {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
        {/* <div className="flex items-center justify-between border-t p-2">
          <div></div>
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              type="submit"
              className="flex items-center justify-center gap-1"
              name="__action"
              value="delete"
            >
              <Trash className="w-4 h-4" />
              <span>Delete</span>
            </Button>
            <Form method="post" action="">
              <Button
                type="submit"
                className="flex items-center justify-center gap-1"
                name="__action"
                value="save"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </Button>
            </Form>
          </div>
        </div> */}
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2 grid place-content-center">
      <p>Testimony not found!</p>
    </div>
  );
}
