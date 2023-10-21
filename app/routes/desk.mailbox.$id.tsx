import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { format } from "date-fns";
import { MoreVertical, Trash, X } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SITE_TITLE } from "~/consts";
import { deleteMail, getMail } from "~/dao/mails.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const __action = formData.get("__action");

  switch (__action) {
    case "delete": {
      const { ok, error } = await deleteMail(params.id as string);

      if (ok) return redirect(`/desk/mailbox`);

      return json({ ok: false, error });
    }

    default: {
      throw new Error("Unknown action");
    }
  }
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (id) {
    const { mail } = await getMail(id);

    if (mail) return json({ mail });

    return json({ mail: null });
  }

  return json({ mail: null });
};

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
  const submit = useSubmit();
  const navigate = useNavigate();

  const back = () => navigate("/desk/mailbox");

  const _delete = () => submit({ __action: "delete" }, { method: "post" });

  if (mail) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="space-y-1 border-b p-2">
          <div className="flex items-center justify-between">
            <p className="line-clamp-1 font-outfit font-medium">
              {mail.subject}
            </p>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <ActionButton tooltip="close" icon={MoreVertical} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={_delete}>
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ActionButton tooltip="close" icon={X} action={back} />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          <div className="flex flex-wrap items-start justify-between gap-1">
            <p className="flex flex-wrap items-center gap-1">
              <span className="font-outfit font-medium">{mail.name}</span>
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
    <div className="grid h-full w-full place-content-center p-2">
      <p>Mail not found!</p>
    </div>
  );
}
