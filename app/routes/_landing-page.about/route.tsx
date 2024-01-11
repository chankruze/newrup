import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { client } from "~/lib/db.server";
import MilestoneTimeline from "./milestone-timeline";

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

  const milestones = await _db
    .collection("milestones")
    .find(
      {},
      {
        sort: {
          date: -1,
        },
      },
    )
    .toArray();

  return json({
    section,
    milestones,
  });
};

export default function AboutPage() {
  const { section, milestones } = useLoaderData<typeof loader>();

  if (!section) return null;

  return (
    <main className="max-w-8xl mx-auto mt-16 p-[5vw] sm:mt-4">
      <section
        className="mx-auto grid max-w-7xl gap-8 space-y-6 md:grid-cols-2"
        id="about"
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="font-outfit text-3xl font-bold uppercase text-title sm:text-4xl">
              {section.title}
            </h1>
            <div className="h-1 w-full bg-blue-400 dark:bg-yellow-400 sm:w-48"></div>
            {section.subtitle ? (
              <h2 className="font-poppins text-lg font-medium  capitalize text-muted-foreground sm:text-xl">
                {section.subtitle}
              </h2>
            ) : null}
          </div>

          <div className="w-full">
            <img
              src={section.image}
              alt={`${section.title}`}
              className="float-left mr-4 w-1/2"
            />
            <p className="text-justify text-zinc-500 dark:text-zinc-400 md:text-lg">
              {section.description}
            </p>
          </div>
        </div>
        <div className="h-full">
          <h2 className="pb-4 font-outfit text-lg font-medium text-blue-600 underline">
            Milestones & Roadmap
          </h2>
          {milestones && milestones.length > 0 ? (
            <MilestoneTimeline milestonesData={milestones} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <img
                src="/svgs/undraw_blank_canvas.svg"
                className="h-96"
                alt="blank"
              />
              <p>No data found!</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
