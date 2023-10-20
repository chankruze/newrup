import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import { MoreVertical, X } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { SITE_TITLE } from "~/consts";
import { getCertification } from "~/dao/certifications.server";
import { cn } from "~/lib/utils";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (id) {
    const { ok, certification } = await getCertification(id);

    if (ok) return json({ certification });

    return json({ certification: null });
  }

  return json({ certification: null });
};

export type CertificationLoader = typeof loader;

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.certification?.name} / ${SITE_TITLE}` },
    {
      property: "og:title",
      content: `${data?.certification?.name} / ${SITE_TITLE}`,
    },
    { name: "description", content: `${data?.certification?.description}` },
  ];
};

export default function CertificationPage() {
  const { certification } = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  const back = () => navigate("/desk/certifications");

  if (certification) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="space-y-1 border-b p-2">
          <div className="flex items-center justify-between">
            <p className="font-outfit font-medium line-clamp-1">
              {certification.name}
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
              {format(new Date(certification.updatedAt), "dd-MM-yyyy hh:mm a")}
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
      <p>Certification not found!</p>
    </div>
  );
}
