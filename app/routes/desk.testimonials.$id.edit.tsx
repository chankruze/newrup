import type { ActionFunctionArgs } from "@remix-run/node";
import { json, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, useNavigation, useRouteLoaderData } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { updateTestimony } from "~/dao/testimonials.server";
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
      const { ok, error } = await updateTestimony(
        params.id as string,
        formData
      );

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

export default function TestimonyEditPage() {
  const { testimony } = useRouteLoaderData<SectionLoader>(
    "routes/desk.testimonials.$id"
  );

  const { state } = useNavigation();

  const busy = state === "submitting";

  const [formData, setFormData] = useState({
    name: testimony.name || "",
    position: testimony.position || "",
    content: testimony.content || "",
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
            <Label htmlFor="position">Position</Label>
            <Input
              type="text"
              id="position"
              name="position"
              onChange={onChangeHandler}
              value={formData.position}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="image">Image</Label>
            {testimony.image ? (
              <p className="text-xs line-clamp-1">
                Current:{" "}
                <a
                  href={testimony.image}
                  target="_blank"
                  rel="noreferrer"
                  className="italic underline text-blue-500"
                >
                  {extractFileNameFromUrl(testimony.image)}
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
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              onChange={onChangeHandler}
              value={formData.content}
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