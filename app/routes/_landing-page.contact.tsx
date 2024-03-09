import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { SITE_DESCRIPTION, SITE_TITLE, contactDetails } from "~/consts";
import { createMail } from "~/dao/mails.server";
import { client } from "~/lib/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const __action = formData.get("__action");

  switch (__action) {
    case "send-message": {
      const name = formData.get("name") as string;
      const phone = formData.get("phone") as string;
      const email = formData.get("email") as string;
      const subject = formData.get("subject") as string;
      const message = formData.get("message") as string;

      const { id, error } = await createMail({
        name,
        phone,
        email,
        subject,
        message,
      });

      if (id) return json({ ok: true, message: "Message sent!" });

      return json({ ok: false, message: "Unable to send message.", error });
    }

    default: {
      return json({ ok: false, message: "Unknow action" }, { status: 400 });
    }
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const section = await _db.collection("sections").findOne({
    title: "Contact us",
  });

  return json({
    section,
  });
};

export const meta: MetaFunction = () => {
  return [
    { title: `Contact Us  / ${SITE_TITLE}` },
    { name: "og:title", content: `Contact Us / ${SITE_TITLE}` },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export default function ContactUsPage() {
  const { state } = useNavigation();
  const { section } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);

  const busy = state === "submitting";

  useEffect(() => {
    if (actionData) {
      if (actionData.ok) {
        if (formRef.current) {
          formRef.current.reset();
          toast.success(actionData.message);
        }
      }
    }
  }, [actionData]);

  if (!section) return null;

  return (
    <main className="max-w-8xl mx-auto mt-16 p-[5vw] sm:mt-4">
      <section className="mx-auto max-w-7xl space-y-6" id="contact">
        <div className="space-y-2">
          <h1 className="font-outfit text-3xl font-bold uppercase text-title sm:text-4xl">
            {section.title}
          </h1>
          <div className="h-1.5 w-48 bg-blue-400 dark:bg-yellow-400"></div>
          {section.subtitle ? (
            <h2 className="font-poppins text-lg font-medium  capitalize text-muted-foreground sm:text-xl">
              {section.subtitle}
            </h2>
          ) : null}
        </div>
        <div className="flex flex-wrap justify-between gap-4">
          <div className="w-full space-y-4 sm:flex-1">
            <p className="w-full text-xl text-zinc-500 dark:text-zinc-400">
              {section.description}
            </p>
            <div className="grid place-content-center gap-4 sm:grid-cols-2">
              {contactDetails.map((details) => (
                <a
                  href={details.url}
                  key={details.name}
                  className="flex flex-1 flex-col items-center justify-start gap-4 p-4"
                >
                  <div
                    className="duration-250 rounded-full bg-blue-300/30 p-3 text-blue-400 transition-colors
            hover:bg-blue-300/50 dark:bg-yellow-800/30 dark:text-yellow-400 dark:hover:bg-yellow-800/50"
                  >
                    <details.icon className="h-6 w-6" />
                  </div>
                  {details.value ? (
                    <div className="space-y-1">
                      {details.value.map((val) => (
                        <p key={val} className="text-center">
                          {val}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </a>
              ))}
            </div>
          </div>
          <div className="grid w-full place-items-end sm:flex-1">
            <Form
              className="w-full max-w-md space-y-8"
              method="post"
              ref={formRef}
            >
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="i.e. Chandan Kumar Mandal"
                  required
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="phone">Your Phone Number</Label>
                <Input
                  type="text"
                  id="phone"
                  placeholder="i.e. +91-9205639328"
                  name="phone"
                  required
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="email">Your Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="i.e. john@gmail.com"
                  required
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="i.e. Business Inquiry"
                  required
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required />
              </div>
              <div>
                <Button
                  className="w-full"
                  type="submit"
                  name="__action"
                  value="send-message"
                  disabled={busy}
                >
                  {busy ? "Sending Message..." : "Send Message"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </section>
    </main>
  );
}
