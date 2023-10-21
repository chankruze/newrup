import { useRouteLoaderData } from "@remix-run/react";
import { AutoCarousel } from "~/components/auto-carousel";
import type { CarouselLoader } from "./desk.carousels.$id";

export default function CarouselPreviewPage() {
  const { carousel } = useRouteLoaderData<CarouselLoader>(
    "routes/desk.carousels.$id",
  );

  return (
    <div className="grid h-full w-full place-items-center overflow-y-auto p-4">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-lg">
        <AutoCarousel images={carousel.images} />
      </div>
    </div>
  );
}
