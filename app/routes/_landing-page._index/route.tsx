import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { getAllPartners } from "~/dao/partners.server";
import { getAllProducts } from "~/dao/products.server";
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
  const { products } = await getAllProducts(3);

  return json({
    carousel,
    products,
    partners,
    testimonials: {
      data: testimonials,
      section: testimonialsSection,
    },
  });
};

export default function Home() {
  const { carousel, products, partners, testimonials } =
    useLoaderData<typeof loader>();

  return (
    <main className="max-w-8xl mx-auto px-[5vw]">
      {carousel ? (
        <section className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 space-y-4">
          <ImageCarousel images={carousel.images} />
        </section>
      ) : null}

      {/* products */}
      {products ? (
        <section id="products" className="mx-auto max-w-7xl space-y-4 py-12">
          <div className="space-y-2">
            <h1 className="font-outfit text-3xl font-bold capitalize sm:text-4xl">
              Our Products
            </h1>
            <h2 className="text-lg font-medium capitalize  text-muted-foreground sm:text-xl">
              These are the products we offer!
            </h2>
          </div>
          <div className="pt-6">
            {products.map((product) => (
              <div
                key={product.title}
                className="w-full max-w-md rounded-lg border p-6 shadow-lg"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-48 w-full rounded-md object-cover"
                  loading="lazy"
                />
                <h2 className="mt-4 font-outfit text-xl font-medium">
                  {product.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
                <a
                  href={product.video}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block cursor-pointer rounded-lg bg-primary py-3 text-center font-semibold text-primary-foreground transition-colors duration-300 ease-in-out hover:bg-primary/80"
                >
                  Watch Video
                </a>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* partners */}
      {partners ? (
        <section
          id="partners"
          className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 space-y-4 py-12"
        >
          <h1 className="font-outfit text-3xl font-bold capitalize sm:text-4xl">
            Our Partners
          </h1>
          <Partners partners={partners} />
        </section>
      ) : null}

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
