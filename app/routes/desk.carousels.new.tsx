import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useNavigate, useNavigation } from "@remix-run/react";
import { X } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { ActionButton } from "~/components/action-button";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { createCarousel } from "~/dao/carousels.server";
import { uploadImageToCloudinary } from "~/lib/upload.server";
import { generateSlug } from "~/utils/generate-slug";

export const meta: MetaFunction = () => {
  return [
    { title: `New Carousel / ${SITE_TITLE}` },
    { name: "og:title", content: `New Carousel / ${SITE_TITLE}` },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
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

  const __action = formData.get("__action");

  switch (__action) {
    case "create": {
      const name = formData.get("name") as string;
      const domId = formData.get("domId") as string;
      const description = formData.get("description") as string;
      const shuffle = formData.get("shuffle") === "on";

      const { id, error } = await createCarousel({
        name,
        domId,
        description,
        shuffle,
        images: uploadedImages,
      });

      if (id) return redirect(`/desk/carousels/${id}/preview`);

      return json({ ok: false, error });
    }

    default: {
      throw new Error("Unknown action");
    }
  }
};

export default function NewCarouselPage() {
  const navigate = useNavigate();
  const { state } = useNavigation();
  const [domId, setDomId] = useState("");

  const busy = state === "submitting";

  const back = () => navigate("/desk/carousels");

  const generateDomId = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target) {
      const _domId = generateSlug(e.target.value);
      setDomId(_domId);
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b p-2">
        <p className="font-outfit font-medium">New Carousel</p>
        <ActionButton tooltip="close" icon={X} action={back} />
      </div>
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
                onChange={generateDomId}
                required
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="domId">DOM Id</Label>
              <Input
                type="text"
                id="domId"
                name="domId"
                value={domId}
                required
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="description">Description</Label>
              <Input type="text" id="description" name="description" required />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="images">Images</Label>
              <Input
                type="file"
                id="images"
                name="images"
                accept="image/png, image/jpeg"
                required
                multiple
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox name="shuffle" id="shuffle" />
              <Label htmlFor="shuffle">Shuffle images</Label>
            </div>
            <div>
              <Button
                className="w-full"
                type="submit"
                name="__action"
                value="create"
                disabled={busy}
              >
                {busy ? "Creating..." : "Create"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
