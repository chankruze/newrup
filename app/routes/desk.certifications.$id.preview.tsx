import { useRouteLoaderData } from "@remix-run/react";
import type { CertificationLoader } from "./desk.certifications.$id";

export default function CertificationPreviewPage() {
  const { certification } = useRouteLoaderData<CertificationLoader>(
    "routes/desk.certifications.$id",
  );

  return (
    <div className="grid h-full w-full place-items-center overflow-y-auto p-4">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-lg">
        <img
          src={certification.image}
          alt={certification.title}
          className="h-48 w-full rounded-md object-cover"
          loading="lazy"
        />
        <h2 className="mt-4 font-outfit text-xl font-medium">
          {certification.name}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {certification.description}
        </p>
        <a
          href={certification.link}
          target="_blank"
          rel="noreferrer"
          className="mt-4 block cursor-pointer rounded-lg bg-primary py-3 text-center font-semibold text-primary-foreground transition-colors duration-300 ease-in-out hover:bg-primary/80"
        >
          View Certification
        </a>
      </div>
      {/* <a
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
      </a> */}
    </div>
  );
}
