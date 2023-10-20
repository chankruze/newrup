import { useRouteLoaderData } from "@remix-run/react";
import type { CertificationLoader } from "./desk.certifications.$id";

export default function CertificationPreviewPage() {
  const { certification } = useRouteLoaderData<CertificationLoader>(
    "routes/desk.certifications.$id"
  );

  return (
    <div className="h-full w-full grid place-items-center overflow-y-auto p-4">
      <a
        href={certification.link}
        rel="noreferrer"
        target="_blank"
        className="relative w-96 h-60 border group overflow-hidden"
      >
        <img
          src={certification.thumbnail}
          alt={certification.name}
          className="h-full w-full object-cover"
        />
        <div className="opacity-80 -bottom-48 duration-500 transition-all ease-in-out absolute group-hover:bottom-0 bg-primary text-primary-foreground w-full p-4 space-y-1">
          <p className="text-lg font-outfit font-medium">
            {certification.name}
          </p>
          <p className="line-clamp-2 italic">{certification.description}</p>
        </div>
      </a>
    </div>
  );
}
