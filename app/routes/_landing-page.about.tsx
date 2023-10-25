import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { client } from "~/lib/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: `About / ${SITE_TITLE}` },
    { name: "og:title", content: `About / ${SITE_TITLE}` },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const section = await _db.collection("sections").findOne({
    title: "About us",
  });

  return json({
    section,
  });
};

export default function AboutPage() {
  const { section } = useLoaderData<typeof loader>();

  if (!section) return null;

  return (
    <main className="max-w-8xl mx-auto mt-16 p-[5vw] sm:mt-4">
      <section className="mx-auto max-w-7xl space-y-6" id="contact">
        <div className="space-y-2">
          <h1 className="font-outfit text-3xl font-bold uppercase text-title sm:text-4xl">
            {section.title}
          </h1>
          <div className="h-1.5 w-full bg-blue-400 dark:bg-yellow-400 sm:w-48"></div>
          {section.subtitle ? (
            <h2 className="text-lg font-medium capitalize  text-muted-foreground sm:text-xl font-poppins">
              {section.subtitle}
            </h2>
          ) : null}
        </div>
        <div className="flex flex-wrap justify-between gap-4">
          <div className="w-full space-y-4 sm:flex-1">
            <p className="max-w-lg text-xl text-zinc-500 dark:text-zinc-400">
              {section.description}
            </p>
          </div>
          <div className="grid w-full place-items-end sm:flex-1">
            <img src={section.image} alt={`${section.title}`} />
          </div>
        </div>
      </section>
    </main>
  );
}
