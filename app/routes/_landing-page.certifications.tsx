import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { getAllCertifications } from "~/dao/certifications.server";
import { client } from "~/lib/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: `Certifications / ${SITE_TITLE}` },
    { name: "og:title", content: `Certifications / ${SITE_TITLE}` },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const section = await _db.collection("sections").findOne({
    title: "Certifications",
  });

  const { certifications } = await getAllCertifications();

  return json({
    section,
    certifications,
  });
};

export default function CertificationsPage() {
  const { section, certifications } = useLoaderData<typeof loader>();

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
        <div className="w-full space-y-4 sm:flex-1">
          <p className="text-lg">{section.description}</p>
        </div>
        {certifications.length > 0 ? (
          <div className="grid gap-4 border-t py-6 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((certification) => (
              <div
                key={certification.title}
                className="w-full max-w-md rounded-lg border p-6 shadow-lg"
              >
                <img
                  src={certification.image}
                  alt={certification.title}
                  className="h-48 w-full rounded-md object-cover"
                  loading="lazy"
                />
                <h2 className="mt-4 font-outfit text-xl font-medium">
                  {certification.name}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {certification.description}
                </p>
                {certification.link ? (
                  <a
                    href={certification.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 block cursor-pointer rounded-lg bg-primary py-3 text-center font-semibold text-primary-foreground transition-colors duration-300 ease-in-out hover:bg-primary/80"
                  >
                    View Certification
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
