import type { MetaFunction } from "@remix-run/node";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";

export const meta: MetaFunction = () => {
  return [
    { title: `About / ${SITE_TITLE}` },
    { name: "og:title", content: `About / ${SITE_TITLE}` },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export default function AboutPage() {
  return <div>About</div>;
}
