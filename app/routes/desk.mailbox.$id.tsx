import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import { MoreVertical, X } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { SITE_TITLE } from "~/consts";
import { getMail } from "~/dao/mails.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (id) {
    const { mail } = await getMail(id);

    if (mail) return json({ mail });

    return json({ mail: null });
  }

  return json({ mail: null });
};

export type SectionLoader = typeof loader;

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.mail?.name} / ${SITE_TITLE}` },
    {
      property: "og:title",
      content: `${data?.mail?.name} / ${SITE_TITLE}`,
    },
    { name: "description", content: `${data?.mail?.subject}` },
  ];
};

export default function MailPage() {
  const { mail } = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  const back = () => navigate("/desk/mailbox");

  if (mail) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="space-y-1 border-b p-2">
          <div className="flex items-center justify-between">
            <p className="font-outfit font-medium line-clamp-1">
              {mail.subject}
            </p>
            <div className="flex items-center">
              <ActionButton tooltip="Show menu" icon={MoreVertical} />
              <ActionButton tooltip="close" icon={X} action={back} />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          <div className="flex items-start flex-wrap justify-between gap-1">
            <p className="flex items-center flex-wrap gap-1">
              <span className="font-medium font-outfit">{mail.name}</span>
              <span className="text-sm text-muted-foreground">{`<${mail.email}>`}</span>
              <span className="text-sm text-muted-foreground">{`(${mail.phone})`}</span>
            </p>
            <div className="text-sm font-medium ">
              {format(new Date(mail.updatedAt), "dd-MM-yyyy hh:mm a")}
            </div>
          </div>
          <div>{mail.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2 grid place-content-center">
      <p>Mail not found!</p>
    </div>
  );
}
