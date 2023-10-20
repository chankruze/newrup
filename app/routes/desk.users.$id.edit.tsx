import type { ActionFunctionArgs } from "@remix-run/node";
import {
  json,
  redirect,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useNavigation, useRouteLoaderData } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { updateUser } from "~/dao/users.server";
import { uploadHandler } from "~/lib/upload.server";
import type { UserLoader } from "./desk.users.$id";

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
      const { ok, error } = await updateUser(params.id as string, formData);

      if (ok) return redirect(`/desk/users/${params.id}/preview`);

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

export default function UserEditPage() {
  const { user } = useRouteLoaderData<UserLoader>("routes/desk.users.$id");

  const { state } = useNavigation();

  const busy = state === "submitting";

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    role: user.role || "",
  });

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((data) => ({
      ...data,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    setFormData({
      ...user,
    });
  }, [user]);

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
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              onChange={onChangeHandler}
              value={formData.email}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" defaultValue={formData.role}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select the role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEWER">Viewer</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" name="password" />
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
