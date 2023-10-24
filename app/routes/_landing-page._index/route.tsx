import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { getAllPartners } from "~/dao/partners.server";
import { getAllProducts } from "~/dao/products.server";
import { getAllTestimonials } from "~/dao/testimonials.server";
import { client } from "~/lib/db.server";
import { ImageCarousel } from "./image-carousel";
import { Partners } from "./partners";
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

  const productsSection = await _db.collection("sections").findOne({
    title: "Our Products",
  });

  const servicesSection = await _db.collection("sections").findOne({
    title: "Services",
  });

  const { testimonials } = await getAllTestimonials();
  const { partners } = await getAllPartners();
  const { products } = await getAllProducts(3);

  return json({
    carousel,
    products: {
      section: productsSection,
      data: products,
    },
    partners,
    testimonials: {
      data: testimonials,
      section: testimonialsSection,
    },
    services: {
      section: servicesSection,
    },
  });
};

export default function Home() {
  const { carousel, products, partners, testimonials } =
    useLoaderData<typeof loader>();

  return (
    <main className="max-w-8xl mx-auto p-[5vw]">
      {carousel ? (
        <section className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 space-y-4">
          <ImageCarousel images={carousel.images} />
        </section>
      ) : null}

      {/* products */}
      {products ? (
        <section id="products" className="mx-auto max-w-7xl space-y-4 py-12">
          {products.section ? (
            <>
              <div className="space-y-2 text-center sm:text-start">
                <h1 className="text-title font-poppins text-3xl font-bold capitalize sm:text-4xl ">
                  {products.section.title}
                </h1>
                {products.section.subtitle ? (
                  <h2 className="text-lg font-medium capitalize  text-muted-foreground sm:text-xl">
                    {products.section.subtitle}
                  </h2>
                ) : null}
              </div>
              {products.section.description ? (
                <div className="w-full space-y-4 sm:flex-1">
                  <p className="text-lg">{products.section.description}</p>
                </div>
              ) : null}
            </>
          ) : null}
          {products.data ? (
            <>
              <div className="pt-6">
                {products.data.map((product) => (
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
              <div className="w-full py-4 text-center ">
                <Link
                  to="products"
                  className="rounded-lg bg-accent p-3 font-poppins transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground"
                >
                  View all products
                </Link>
              </div>
            </>
          ) : null}
        </section>
      ) : null}

      {/* partners */}
      {partners ? (
        <section id="partners" className="mx-auto max-w-7xl space-y-4 py-12">
          <div className="space-y-2 text-center sm:text-start">
            <h1 className="text-title font-poppins text-3xl font-bold capitalize sm:text-4xl">
              Our Partners
            </h1>
          </div>
          <Partners partners={partners} />
        </section>
      ) : null}

      {/* testimonials */}
      {testimonials ? (
        <section
          id="testimonials"
          className="mx-auto max-w-7xl space-y-4 py-12"
        >
          {testimonials.section ? (
            <>
              <div className="space-y-2 text-center sm:text-start">
                <h1 className="text-title font-poppins text-3xl font-bold capitalize sm:text-4xl ">
                  {testimonials.section.title}
                </h1>
                {testimonials.section.subtitle ? (
                  <h2 className="text-lg font-medium capitalize  text-muted-foreground sm:text-xl">
                    {testimonials.section.subtitle}
                  </h2>
                ) : null}
              </div>
              {testimonials.section.description ? (
                <div className="w-full space-y-4 sm:flex-1">
                  <p className="text-lg">{testimonials.section.description}</p>
                </div>
              ) : null}
            </>
          ) : null}
          {testimonials.data ? (
            <>
              <div className="pt-12">
                <Testimonials testimonials={testimonials.data} />
              </div>
              <div className="w-full py-4 text-center ">
                <Link
                  to="testimonials"
                  className="rounded-lg bg-accent p-3 font-poppins transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground"
                >
                  View all testimonials
                </Link>
              </div>
            </>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
