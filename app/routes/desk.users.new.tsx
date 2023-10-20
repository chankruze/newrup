import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useNavigate, useNavigation } from "@remix-run/react";
import { X } from "lucide-react";
import { ActionButton } from "~/components/action-button";
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
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { registerUser } from "~/dao/users.server";

export const meta: MetaFunction = () => {
  return [
    { title: `New User / ${SITE_TITLE}` },
    { name: "og:title", content: `New User / ${SITE_TITLE}` },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const __action = formData.get("__action");

  switch (__action) {
    case "create": {
      // validate form data
      const { id, error } = await registerUser(formData);

      if (id) return redirect(`/desk/users/${id}/preview`);

      return json({ ok: false, error });
    }

    default: {
      throw new Error("Unknown action");
    }
  }
};

export default function NewUserPage() {
  const navigate = useNavigate();
  const { state } = useNavigation();

  const busy = state === "submitting";

  const back = () => navigate("/desk/users");

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b p-2">
        <p className="font-outfit font-medium">New User</p>
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
              <Input type="text" id="name" name="name" required />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" required />
            </div>
            {/* <div className="grid w-full items-center gap-2">
              <Label htmlFor="image">Image</Label>
              <Input
                type="file"
                id="image"
                name="image"
                accept="image/png, image/jpeg"
                required
              />
            </div> */}
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" defaultValue={"VIEWER"}>
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
