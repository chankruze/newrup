import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  json,
  redirect,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useNavigate, useNavigation } from "@remix-run/react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { ActionButton } from "~/components/action-button";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { createMilestone } from "~/dao/milestones.server";
import { uploadHandler } from "~/lib/upload.server";
import { cn } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [
    { title: `New Milestone / ${SITE_TITLE}` },
    { name: "og:title", content: `New Milestone / ${SITE_TITLE}` },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  );

  const __action = formData.get("__action");

  switch (__action) {
    case "add": {
      const { id, error } = await createMilestone(formData);

      if (id) return redirect(`/desk/milestones/${id}/preview`);

      return json({ ok: false, error });
    }

    default: {
      throw new Error("Unknown action");
    }
  }
};

export default function NewMilestonePage() {
  const navigate = useNavigate();
  const { state } = useNavigation();
  const [date, setDate] = useState<Date>();

  const busy = state === "submitting";

  const back = () => navigate("/desk/milestones");

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b p-2">
        <p className="font-outfit font-medium">New Milestone</p>
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
              <Label htmlFor="title">Title</Label>
              <Input type="text" id="title" name="title" required />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="link">Link</Label>
              <Input type="text" id="link" name="link" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
            {date ? (
              <input value={date.toISOString()} name="date" hidden />
            ) : null}
            <div>
              <Button
                className="w-full"
                type="submit"
                name="__action"
                value="add"
                disabled={busy}
              >
                {busy ? "Adding..." : "Add"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
