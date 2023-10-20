import type { ActionFunctionArgs } from "@remix-run/node";
import { json, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, useNavigation, useRouteLoaderData } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { updateCarousel } from "~/dao/carousels.server";
import { uploadHandler } from "~/lib/upload.server";
import { extractFileNameFromUrl } from "~/utils/extract-filename";
import type { SectionLoader } from "./desk.sections.$id";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  // get the form action and check if it's:
  // 1. save
  // 2. delete
  const __action = formData.get("__action");

  switch (__action) {
    case "save": {
      const { ok, error } = await updateCarousel(params.id as string, formData);

      if (ok)
        return json({
          ok: true,
        });

      return json({ ok: false, error });
    }

    case "delete": {
      return json({
        ok: false,
        error: "Action not implemented yet.",
      });
    }

    default: {
      throw new Error("Unknown action");
    }
  }
};

export default function CarouselEditPage() {
  const { carousel } = useRouteLoaderData<SectionLoader>(
    "routes/desk.carousels.$id"
  );

  const { state } = useNavigation();

  const busy = state === "submitting";

  const [formData, setFormData] = useState({
    name: carousel.name || "",
    description: carousel.description || "",
  });

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((data) => ({
      ...data,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="h-full w-full p-2">
      <div className="mx-auto max-w-2xl px-2 py-2 md:py-8">
        <Form
          className="w-full space-y-8"
          method="post"
          encType="multipart/form-data"
        >
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              onChange={onChangeHandler}
              value={formData.name}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="description">Position</Label>
            <Input
              type="text"
              id="description"
              name="description"
              onChange={onChangeHandler}
              value={formData.description}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="images">Images</Label>
            <Input
              type="file"
              id="images"
              name="images"
              accept="image/png, image/jpeg"
              onChange={onChangeHandler}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox name="shuffle" id="shuffle" />
            <Label htmlFor="shuffle">Shuffle images</Label>
          </div>
          <div className="grid w-full items-center gap-2">
            {carousel.images.length > 0 ? (
              <div className="grid grid-cols-4 place-content-center gap-2">
                {carousel.images.map((image) => (
                  <div
                    key={image}
                    className="max-h-24 overflow-hidden bg-red-400"
                  >
                    <a href={image} target="_blank" rel="noreferrer">
                      <img
                        src={image}
                        alt={`Pic 1 of ${carousel.name}`}
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />
                      {extractFileNameFromUrl(image)}
                    </a>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div>
            <Button
              className="w-full"
              type="submit"
              name="__action"
              value="save"
              disabled={busy}
            >
              {busy ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
