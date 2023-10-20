import type { MetaFunction } from "@remix-run/node";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";

export const meta: MetaFunction = () => {
  return [
    { title: `Certifications / ${SITE_TITLE}` },
    { name: "og:title", content: `Certifications / ${SITE_TITLE}` },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export default function CertificationsPage() {
  return <div>Certifications</div>;
}
