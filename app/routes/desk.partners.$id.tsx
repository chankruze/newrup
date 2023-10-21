import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import { MoreVertical, X } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { ActionTabButton } from "~/components/action-tab-button";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { getPartner } from "~/dao/partners.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (id) {
    const { partner } = await getPartner(id);

    if (partner) return json({ partner });

    return json({ partner: null });
  }

  return json({ partner: null });
};

export type PartnerLoader = typeof loader;

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.partner?.name} / ${SITE_TITLE}` },
    {
      property: "og:title",
      content: `${data?.partner?.name} / ${SITE_TITLE}`,
    },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export default function PartnerPage() {
  const { partner } = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  const back = () => navigate("/desk/partners");

  if (partner) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="space-y-1 border-b p-2">
          <div className="flex items-center justify-between">
            <p className="line-clamp-1 font-outfit font-medium">
              {partner.name}
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
              {format(new Date(partner.updatedAt), "dd-MM-yyyy hh:mm a")}
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
      <p>Partner not found!</p>
    </div>
  );
}