import type { ActionFunctionArgs } from "@remix-run/node";
import { json, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, useNavigation, useRouteLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { ChangeEvent } from "react";
import { useState } from "react";
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
import { updateMilestone } from "~/dao/milestones.server";
import { uploadHandler } from "~/lib/upload.server";
import { cn } from "~/lib/utils";
import type { MilestoneLoader } from "./desk.milestones.$id";

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
      const { ok, error } = await updateMilestone(
        params.id as string,
        formData,
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

export default function MilestoneEditPage() {
  const { milestone } = useRouteLoaderData<MilestoneLoader>(
    "routes/desk.milestones.$id",
  );
  const [date, setDate] = useState<Date>(parseISO(milestone.date));

  const { state } = useNavigation();

  const busy = state === "submitting";

  const [formData, setFormData] = useState({
    title: milestone.title || "",
    description: milestone.description || "",
    link: milestone.link || "",
  });

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
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
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              onChange={onChangeHandler}
              value={formData.title}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              onChange={onChangeHandler}
              value={formData.description}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="link">Link</Label>
            <Input
              type="text"
              id="link"
              name="link"
              onChange={onChangeHandler}
              value={formData.link}
            />
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
