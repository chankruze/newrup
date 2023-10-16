import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { X } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";

export const meta: MetaFunction = () => {
  return [
    { title: `Sections / ${SITE_TITLE}` },
    { name: "og:title", content: `Sections / ${SITE_TITLE}` },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export default function SectionsIndex() {
  const navigate = useNavigate();

  const back = () => navigate("/desk/sections");

  return (
    <div className="h-full p-2">
      <div className="flex items-center justify-between">
        <div>Title</div>
        <ActionButton tooltip="close" icon={X} action={back} />
      </div>
    </div>
  );
}
