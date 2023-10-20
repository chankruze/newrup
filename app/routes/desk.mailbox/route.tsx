import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { MoreVertical } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { Separator } from "~/components/ui/separator";
import { getAllMails } from "~/dao/mails.server";
import { requireUserId } from "~/lib/session.server";
import { cn } from "~/lib/utils";
import { MailListItem } from "./mail-list-item";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const { mails } = await getAllMails();

  if (mails) return json({ mails });

  return json({ userId, mails: [] });
};

export default function MailsLayout() {
  const location = useLocation();
  const hideParent = location.pathname !== "/desk/mailbox";
  const { mails } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full overflow-hidden">
      <div
        className={cn("w-full flex-col border-r flex md:w-72", {
          "md:flex hidden": hideParent,
        })}
      >
        <div className="flex items-center justify-between p-2">
          <p className="font-outfit font-medium">Mails</p>
          <div className="flex items-center">
            <ActionButton icon={MoreVertical} tooltip="Show menu" />
          </div>
        </div>
        <Separator />
        {mails.length > 0 ? (
          <div className="flex-1 space-y-1 overflow-y-auto">
            {mails.map((mail) => (
              <MailListItem
                key={mail._id.toString()}
                name={mail.name}
                to={mail._id.toString()}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex justify-center items-center p-2">
            <p>No mails found</p>
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
