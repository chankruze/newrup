import { Outlet } from "@remix-run/react";
import { Topbar } from "./topbar";

export default function LandingPageLayout() {
  return (
    <>
      <Topbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
