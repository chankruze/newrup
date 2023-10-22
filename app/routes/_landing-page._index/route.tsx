import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ArrowRight } from "lucide-react";
import { SocialLink } from "~/components/social-links";
import { SITE_DESCRIPTION, SITE_TITLE, socialLinks } from "~/consts";
import { getAllPartners } from "~/dao/partners.server";
import { getAllTestimonials } from "~/dao/testimonials.server";
import { client } from "~/lib/db.server";
import { StatsCard } from "./StatsCard";
import { ImageCarousel } from "./image-carousel";
import { Partners } from "./partners";
import { statsData } from "./stats-data";
import { Testimonials } from "./testimonials";

export const meta: MetaFunction = () => {
  return [
    { title: SITE_TITLE },
    { name: "og:title", content: SITE_TITLE },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export const loader = async (_: LoaderFunctionArgs) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const carousel = await _db.collection("carousels").findOne({
    domId: "hero-carousel",
  });
  const testimonialsSection = await _db.collection("sections").findOne({
    title: "Testimonials",
  });

  const { testimonials } = await getAllTestimonials();
  const { partners } = await getAllPartners();

  return json({
    carousel,
    partners,
    testimonials: {
      data: testimonials,
      section: testimonialsSection,
    },
  });
};

export default function Home() {
  const { carousel, partners, testimonials } = useLoaderData<typeof loader>();

  return (
    <main className="max-w-8xl mx-auto p-[5vw]">
      <header className="relative mx-auto flex max-w-7xl flex-wrap justify-between gap-12 sm:gap-16 py-12">
        {/* left */}
        <div className="flex flex-col gap-4 lg:pt-12">
          <p className="font-roboto-mono text-4xl text-zinc-500 dark:text-zinc-400">
            We're
          </p>
          <h1 className="font-outfit text-7xl font-black">
            Newrup Tech <br /> Solutions
          </h1>
          <div className="h-2 w-64 bg-blue-400 dark:bg-yellow-400"></div>
          <p className="max-w-md font-outfit text-xl text-zinc-500 dark:text-zinc-400">
            {SITE_DESCRIPTION}
          </p>
        </div>
        {/* right */}
        <div className="z-10 order-2 flex flex-col gap-4">
          <p className="font-outfit text-xl font-medium dark:text-zinc-300 sm:max-w-sm sm:text-2xl lg:max-w-md">
            Let's build quality products and solve some real world problems with
            our services.
          </p>
          <Link
            to="#services"
            className="flex items-center gap-2 font-outfit font-medium text-blue-500 dark:text-yellow-400 sm:text-lg"
          >
            <span>Read More</span>
            <span>
              <ArrowRight className="h-6 w-6" />
            </span>
          </Link>
          <div className="flex items-center justify-center gap-4 sm:justify-start lg:justify-end">
            {socialLinks.slice(0, 5).map((link) => (
              <SocialLink key={link.name} {...link} />
            ))}
          </div>
        </div>
      </header>
      {carousel ? (
        <section className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 space-y-4 py-24">
          <ImageCarousel images={carousel.images} />
        </section>
      ) : null}
      {/* partners */}
      <section
        id="partners"
        className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 space-y-4 py-12"
      >
        <h1 className="font-outfit text-3xl font-bold capitalize sm:text-4xl">
          Our Partners
        </h1>
        <Partners partners={partners} />
      </section>
      {/* stats */}
      <section
        id="services"
        className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 py-12"
      >
        {/* left */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold capitalize sm:text-4xl">
            What can We do for you
          </h1>
          <p className="max-w-lg  text-xl text-zinc-500 dark:text-zinc-400">
            We understand that each client has unique goals and challenges,
            which is why We offer personalized attention, cost-effective
            strategies, and innovative ideas to help you achieve success.
            <br />
            <br />
            Whether you need help with a specific project or ongoing support for
            your business, We are here to provide tailored solutions and expert
            guidance that meets your specific needs.
          </p>
        </div>
        {/* right */}
        <div className="grid w-full place-content-start gap-4 sm:col-start-3 sm:w-auto sm:grid-cols-2">
          {statsData.map((stats) => (
            <StatsCard key={stats.id} {...stats} />
          ))}
        </div>
      </section>
      {/* testimonials */}
      {testimonials.data && testimonials.section ? (
        <section
          id="testimonials"
          className="mx-auto min-h-screen max-w-7xl space-y-4 py-12"
        >
          <div className="space-y-2">
            <h1 className="font-outfit text-3xl font-bold capitalize sm:text-4xl">
              {testimonials.section.title}
            </h1>
            {testimonials.section.subtitle ? (
              <h2 className="text-lg font-medium capitalize  text-muted-foreground sm:text-xl">
                {testimonials.section.subtitle}
              </h2>
            ) : null}
          </div>
          <div className="w-full space-y-4 sm:flex-1">
            <p className="text-lg">{testimonials.section.description}</p>
          </div>
          <div className="pt-12">
            <Testimonials testimonials={testimonials.data} />
          </div>
        </section>
      ) : null}
    </main>
  );
}
