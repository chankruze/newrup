import { useRouteLoaderData } from "@remix-run/react";
import type { PartnerLoader } from "./desk.partners.$id";

export default function PartnerPreviewPage() {
  const { partner } = useRouteLoaderData<PartnerLoader>(
    "routes/desk.partners.$id",
  );

  return (
    <div className="grid h-full w-full place-items-center overflow-y-auto p-4">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-lg">
        <img
          src={partner.image}
          alt={partner.name}
          className="h-48 w-full rounded-md object-cover"
          loading="lazy"
        />
        <h2 className="mt-4 text-center font-outfit text-xl font-medium">
          {partner.name}
        </h2>
      </div>
    </div>
  );
}
