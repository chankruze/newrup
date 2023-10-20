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
    "routes/desk.testimonials.$id"
  );

  return (
    <div className="h-full w-full grid place-items-center overflow-y-auto p-4">
      {/* <div className="flex items-start flex-wrap justify-between gap-1">
        <div className="space-y-1">
          <p className="font-medium font-outfit">{testimony.name}</p>
          <p className="text-sm text-muted-foreground">{testimony.position}</p>
        </div>
      </div>
      <div>{testimony.content}</div> */}
      <Card className="w-[350px] text-center">
        <CardHeader>
          <CardTitle className="font-outfit">{testimony.name}</CardTitle>
          <CardDescription>{testimony.position}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="h-24 w-24 mx-auto rounded-full overflow-hidden">
            <img
              src={testimony.image}
              alt={testimony.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-medium italic font-roboto">{testimony.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
