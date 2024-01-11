import { useRouteLoaderData } from "@remix-run/react";
import type { MilestoneLoader } from "./desk.milestones.$id";

export default function MilestonePreviewPage() {
  const { milestone } = useRouteLoaderData(
    "routes/desk.milestones.$id",
  ) as MilestoneLoader;

  return (
    <div className="grid h-full w-full place-items-center overflow-y-auto p-4">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-lg">
        <h2 className="mt-4 font-outfit text-xl font-medium">
          {milestone.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {milestone.description}
        </p>
        {milestone.link ? (
          <a
            href={milestone.link}
            target="_blank"
            rel="noreferrer"
            className="mt-4 block cursor-pointer rounded-lg bg-primary py-3 text-center font-semibold text-primary-foreground transition-colors duration-300 ease-in-out hover:bg-primary/80"
          >
            More Details
          </a>
        ) : null}
      </div>
    </div>
  );
}
