import type { ActionFunctionArgs } from "@remix-run/node";
import {
  json,
  redirect,
  unstable_parseMultipartFormData
} from "@remix-run/node";
import { Form, useNavigation, useRouteLoaderData } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { updatePartner } from "~/dao/partners.server";
import { uploadHandler } from "~/lib/upload.server";
import { extractFileNameFromUrl } from "~/utils/extract-filename";
import type { PartnerLoader } from "./desk.partners.$id";

export const action = async ({ request, params }: ActionFunctionArgs) => {
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
      const name = formData.get("name");
      let image = formData.get("image");

      if (image instanceof Blob) {
        image = null;
      }

      const { ok, error } = await updatePartner(params.id as string, {
        name,
        image,
      });

      if (ok) return redirect(`/desk/partners/${params.id}/preview`);

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

export default function PartnerEditPage() {
  const { partner } = useRouteLoaderData<PartnerLoader>(
    "routes/desk.partners.$id",
  );

  const { state } = useNavigation();

  const busy = state === "submitting";

  const [formData, setFormData] = useState({
    name: partner.title || "",
  });

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData((data) => ({
      ...data,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    setFormData({
      ...partner,
    });
  }, [partner]);

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
            <Label htmlFor="image">Image</Label>
            {partner.image ? (
              <p className="line-clamp-1 text-xs">
                Current:{" "}
                <a
                  href={partner.image}
                  target="_blank"
                  rel="noreferrer"
                  className="italic text-blue-500 underline"
                >
                  {extractFileNameFromUrl(partner.image)}
                </a>
              </p>
            ) : null}
            <Input
              type="file"
              id="image"
              name="image"
              accept="image/png, image/jpeg"
              placeholder="i.e. lorem ipsum"
              onChange={onChangeHandler}
            />
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
