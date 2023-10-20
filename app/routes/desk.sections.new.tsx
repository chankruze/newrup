import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { X } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";

export const meta: MetaFunction = () => {
  return [
    { title: `New Section / ${SITE_TITLE}` },
    { name: "og:title", content: `New Section / ${SITE_TITLE}` },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export default function SectionNewPage() {
  const navigate = useNavigate();

  const back = () => navigate("/desk/sections");

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b p-2">
        <div>New Section</div>
        <ActionButton tooltip="close" icon={X} action={back} />
      </div>
    </div>
  );
}
