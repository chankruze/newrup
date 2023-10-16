import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireUserId } from "~/lib/session.server";
import { BottomNavList } from "./bottom-nav-list";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export type DeskLoader = typeof loader;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  return json({ userId });
};

export default function DeskLayout() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          {/* <DialogProvider /> */}
          <Outlet />
        </div>
      </div>
      {/* mobile bottom navbar */}
      <nav className="md:hidden">
        <BottomNavList />
      </nav>
    </div>
  );
}
