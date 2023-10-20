import type { MetaFunction } from "@remix-run/node";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";

export const meta: MetaFunction = () => {
  return [
    { title: SITE_TITLE },
    { name: "og:title", content: SITE_TITLE },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export default function Home() {
  return <div></div>;
}
