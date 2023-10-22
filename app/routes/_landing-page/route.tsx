import { Outlet } from "@remix-run/react";
import { Credits } from "./credits";
import { Footer } from "./footer";
import { Navbar } from "./navbar";

export default function LandingPageLayout() {
  return (
    <>
      {/* <Topbar /> */}
      <Navbar />
      <Outlet />
      <Footer />
      <Credits />
    </>
  );
}
