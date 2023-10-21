import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { MoreVertical, X } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { ActionTabButton } from "~/components/action-tab-button";
import { SITE_TITLE } from "~/consts";
import { getCarousel } from "~/dao/carousels.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (id) {
    const { carousel } = await getCarousel(id);

    if (carousel) return json({ carousel });

    return json({ carousel: null });
  }

  return json({ carousel: null });
};

export type CarouselLoader = typeof loader;

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.carousel?.name} / ${SITE_TITLE}` },
    {
      property: "og:title",
      content: `${data?.carousel?.name} / ${SITE_TITLE}`,
    },
    { name: "description", content: `${data?.carousel?.description}` },
  ];
};

export default function CarouselPage() {
  const { carousel } = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  const back = () => navigate("/desk/carousels");

  if (carousel) {
    const lastUpdated = new Date(carousel.updatedAt);

    return (
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="space-y-1 border-b p-2">
          <div className="flex items-center justify-between">
            <p className="line-clamp-1 font-outfit font-medium">
              {carousel.name}
            </p>
            <div className="flex items-center">
              <ActionButton tooltip="Show menu" icon={MoreVertical} />
              <ActionButton tooltip="close" icon={X} action={back} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              <ActionTabButton to="edit" label="Editor" />
              <ActionTabButton to="preview" label="Preview" />
            </div>
            <div className="text-sm">
              {lastUpdated.toLocaleDateString()}{" "}
              {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full w-full place-content-center p-2">
      <p>Carousel not found!</p>
    </div>
  );
}
