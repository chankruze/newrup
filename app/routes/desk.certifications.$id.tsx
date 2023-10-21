import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import { MoreVertical, X } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { ActionTabButton } from "~/components/action-tab-button";
import { SITE_TITLE } from "~/consts";
import { getCertification } from "~/dao/certifications.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (id) {
    const { certification } = await getCertification(id);

    if (certification) return json({ certification });

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
            <p className="line-clamp-1 font-outfit font-medium">
              {certification.name}
            </p>
            <div className="flex items-center">
              <ActionButton tooltip="Show menu" icon={MoreVertical} />
              <ActionButton tooltip="close" icon={X} action={back} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              <ActionTabButton to="edit" label="Editor" />
              <ActionTabButton to="preview" label="Preview" />
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
    <div className="grid h-full w-full place-content-center p-2">
      <p>Certification not found!</p>
    </div>
  );
}
