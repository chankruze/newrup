import { useRouteLoaderData } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { TestimonyLoader } from "./desk.testimonials.$id";

export default function TestimonyPreviewPage() {
  const { testimony } = useRouteLoaderData<TestimonyLoader>(
    "routes/desk.testimonials.$id",
  );

  return (
    <div className="grid h-full w-full place-items-center overflow-y-auto p-4">
      <Card className="w-full max-w-md rounded-lg border text-center shadow-lg">
        <CardHeader>
          <CardTitle className="font-outfit text-lg">
            {testimony.name}
          </CardTitle>
          <CardDescription className="font-roboto">
            {testimony.position}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full">
            <img
              src={testimony.image}
              alt={testimony.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="font-outfit font-medium">{testimony.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
