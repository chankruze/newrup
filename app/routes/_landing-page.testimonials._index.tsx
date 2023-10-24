import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { getAllTestimonials } from "~/dao/testimonials.server";
import { client } from "~/lib/db.server";
import { TestimonialCard } from "./_landing-page._index/testimonial-card";

export const meta: MetaFunction = () => {
  return [
    { title: `Testimonials / ${SITE_TITLE}` },
    { name: "og:title", content: `Testimonials / ${SITE_TITLE}` },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const section = await _db.collection("sections").findOne({
    title: "Testimonials",
  });

  const { testimonials } = await getAllTestimonials();

  return json({
    section,
    testimonials,
  });
};

export default function TestimonialsPage() {
  const { section, testimonials } = useLoaderData<typeof loader>();

  if (!section) return null;

  return (
    <main className="max-w-8xl mx-auto p-[5vw]">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-title font-outfit text-3xl font-bold capitalize sm:text-4xl">
            {section.title}
          </h1>
          <div className="h-1.5 w-48 bg-blue-400 dark:bg-yellow-400"></div>
          {section.subtitle ? (
            <h2 className="text-lg font-medium capitalize text-muted-foreground sm:text-xl">
              {section.subtitle}
            </h2>
          ) : null}
        </div>
        <div className="text-description w-full space-y-4 sm:flex-1">
          <p className="text-lg">{section.description}</p>
        </div>
        {testimonials && testimonials.length > 0 ? (
          <div className="grid gap-4 border-t py-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} testimony={testimonial} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
