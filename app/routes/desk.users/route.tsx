import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { Edit, MoreVertical } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { Separator } from "~/components/ui/separator";
import { getAllUsers } from "~/dao/users.server";
import { requireUserId } from "~/lib/session.server";
import { cn } from "~/lib/utils";
import { UserListItem } from "./user-list-item";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const { error, users } = await getAllUsers(userId);

  if (users) return json({ users });

  return json({ userId, users: [], error });
};

export default function UsersLayout() {
  const location = useLocation();
  const hideParent = location.pathname !== "/desk/users";
  const { users } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full overflow-hidden">
      <div
        className={cn("w-full flex-col border-r flex md:w-72", {
          "md:flex hidden": hideParent,
        })}
      >
        <div className="flex items-center justify-between p-2">
          <p className="font-outfit font-medium">Users</p>
          <div className="flex items-center">
            <Link to="new">
              <ActionButton icon={Edit} tooltip="Add user" />
            </Link>
            <ActionButton icon={MoreVertical} tooltip="Show menu" />
          </div>
        </div>
        <Separator />
        {users.length > 0 ? (
          <div className="flex-1 space-y-1 overflow-y-auto">
            {users.map((user) => (
              <UserListItem
                key={user._id.toString()}
                name={user.name}
                to={user._id.toString()}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex justify-center items-center p-2">
            <p>No users found</p>
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
