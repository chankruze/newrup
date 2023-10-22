import type { ActionFunctionArgs } from "@remix-run/node";
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useNavigation, useRouteLoaderData } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { updateCarousel } from "~/dao/carousels.server";
import { uploadImageToCloudinary } from "~/lib/upload.server";
import { extractFileNameFromUrl } from "~/utils/extract-filename";
import { generateSlug } from "~/utils/generate-slug";
import type { SectionLoader } from "./desk.sections.$id";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const uploadedImages: string[] = [];

  const uploadHandler = unstable_composeUploadHandlers(
    async ({ name, contentType, data, filename }) => {
      if (name !== "images" || !filename) {
        return undefined;
      }

      try {
        const uploadedImage = await uploadImageToCloudinary(data);

        if (uploadedImage?.secure_url) {
          uploadedImages.push(uploadedImage.secure_url);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // fallback to memory for everything else
    unstable_createMemoryUploadHandler(),
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  );

  // get the form action and check if it's:
  // 1. save
  // 2. delete
  const __action = formData.get("__action");

  switch (__action) {
    case "save": {
      const name = formData.get("name") as string;
      const domId = formData.get("domId") as string;
      const description = formData.get("description") as string;
      const shuffle = formData.get("shuffle") === "on";

      const { ok, error } = await updateCarousel(params.id as string, {
        name,
        domId,
        description,
        shuffle,
        images: uploadedImages,
      });

      if (ok) return redirect(`/desk/carousels/${params.id}/preview`);

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
    "routes/desk.carousels.$id",
  );
  const { state } = useNavigation();
  const [formData, setFormData] = useState({
    name: carousel.name || "",
    domId: carousel.domId || "",
    description: carousel.description || "",
  });

  const busy = state === "submitting";

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData((data) => ({
      ...data,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === "name") {
      const _domId = generateSlug(e.target.value);
      setFormData((data) => ({
        ...data,
        domId: _domId,
      }));
    }
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
            <Label htmlFor="domId">DOM Id</Label>
            <Input
              type="text"
              id="domId"
              name="domId"
              onChange={onChangeHandler}
              value={formData.domId}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="description">Description</Label>
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
              multiple
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
                        className="h-full w-full object-cover"
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
