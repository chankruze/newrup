import { useRouteLoaderData } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { SectionLoader } from "./desk.sections.$id";

export default function SectionPreviewPage() {
  const { section } = useRouteLoaderData<SectionLoader>(
    "routes/desk.sections.$id",
  );

  return (
    <div className="grid h-full w-full place-items-center overflow-y-auto p-4">
      <Card className="w-full rounded-lg border shadow-lg">
        <CardHeader>
          <CardTitle className="font-outfit text-2xl sm:text-3xl">
            {section.title}
          </CardTitle>
          {section.subtitle ? (
            <CardDescription className="font-roboto">
              {section.subtitle}
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {section.image ? (
            <img
              src={section.image}
              alt={section.title}
              className="h-full w-full rounded-md object-cover"
              loading="lazy"
            />
          ) : null}
          <p
            className={cn("md:col-span-2", {
              "md:col-span-3": !section.image,
            })}
          >
            {section.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
