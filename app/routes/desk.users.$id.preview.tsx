import { useRouteLoaderData } from "@remix-run/react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { UserLoader } from "./desk.users.$id";

export default function UserPreviewPage() {
  const { user } = useRouteLoaderData<UserLoader>("routes/desk.users.$id");

  return (
    <div className="grid h-full w-full place-items-center overflow-y-auto p-4">
      <Card className="w-full max-w-md rounded-lg border shadow-lg">
        <CardHeader>
          <CardTitle className="font-outfit">{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
