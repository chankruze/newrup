import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "~/consts";
import { getAllPartners } from "~/dao/partners.server";
import { getAllProducts } from "~/dao/products.server";
import { getAllTestimonials } from "~/dao/testimonials.server";
import { client } from "~/lib/db.server";
import { ProductCard } from "../../components/product-card";
import { ImageCarousel } from "./image-carousel";
import { Partners } from "./partners";
import { stats } from "./stats";
import { StatsCard } from "./stats-card";
import { Testimonials } from "./testimonials";

export const meta: MetaFunction = () => {
  return [
    { title: SITE_TITLE },
    { name: "title", content: SITE_TITLE },
    { name: "author", content: SITE_TITLE },
    { name: "description", content: SITE_DESCRIPTION },
    {
      property: "twitter:title",
      content: SITE_TITLE,
    },
    {
      property: "twitter:description",
      content: SITE_DESCRIPTION,
    },
    {
      property: "twitter:image",
      content: `${SITE_URL}/logo.png`,
    },
    {
      property: "twitter:creator",
      content: SITE_TITLE,
    },
    {
      property: "twitter:site",
      content: SITE_TITLE,
    },
    {
      property: "twitter:summary",
      content: "summary_large_image",
    },
    { property: "og:title", content: SITE_TITLE },
    { property: "og:description", content: SITE_DESCRIPTION },
    { property: "og:type", content: "website" },
    {
      name: "image",
      property: "og:image",
      content: `${SITE_URL}/logo.png`,
    },
    {
      name: "msapplication-TileColor",
      content: "#da532c",
    },
    {
      tagName: "link",
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      tagName: "link",
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      tagName: "link",
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    {
      tagName: "link",
      rel: "manifest",
      href: "/site.webmanifest",
    },
    {
      tagName: "link",
      rel: "mask-icon",
      href: "/safari-pinned-tab.svg",
      color: "#5bbad5",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: `${SITE_URL}/`,
    },
  ];
};

export const loader = async (_: LoaderFunctionArgs) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const carousel = await _db.collection("carousels").findOne({
    domId: "hero-carousel",
  });

  const testimonialsSection = await _db.collection("sections").findOne({
    domId: "testimonials",
  });

  const productsSection = await _db.collection("sections").findOne({
    domId: "products",
  });

  const partnersSection = await _db.collection("sections").findOne({
    domId: "partners",
  });

  const servicesSection = await _db.collection("sections").findOne({
    domId: "services",
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
    partners: {
      data: partners,
      section: partnersSection,
    },
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
    <main className="mt-8">
      {carousel ? (
        <div className="p-[5vw]">
          <section className="mx-auto mt-8 flex max-w-7xl flex-wrap justify-between gap-4 space-y-4">
            <ImageCarousel images={carousel.images} />
          </section>
        </div>
      ) : null}

      {/* products */}
      {products ? (
        <div className="w-full bg-blue-50/50 p-[5vw]">
          <section id="products" className="mx-auto max-w-7xl space-y-4">
            {products.section ? (
              <>
                <div className="space-y-2 text-center sm:text-start">
                  <h1 className="border-b py-1 font-outfit text-3xl  font-bold uppercase text-title sm:text-4xl">
                    {products.section.title}
                  </h1>
                  {products.section.subtitle ? (
                    <h2 className="font-poppins text-lg font-medium  capitalize text-muted-foreground sm:text-xl">
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
                    <ProductCard key={product.title} product={product} />
                  ))}
                </div>
                <div className="w-full py-4 text-center ">
                  <Link
                    to="products"
                    className="rounded-lg bg-blue-500 p-3 font-poppins text-primary-foreground transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground"
                  >
                    View all products
                  </Link>
                </div>
              </>
            ) : null}
          </section>
        </div>
      ) : null}

      {/* stats */}
      {stats ? (
        <div className="w-full p-[5vw]">
          <section
            id="stats"
            className="mx-auto flex max-w-7xl flex-wrap justify-evenly gap-4"
          >
            {stats.map((s) => (
              <div key={s.id} className="flex-1">
                <StatsCard {...s} />
              </div>
            ))}
          </section>
        </div>
      ) : null}

      {/* partners */}
      {partners ? (
        <div className="w-full p-[5vw]">
          <section id="partners" className="mx-auto max-w-7xl space-y-4">
            {partners.section ? (
              <>
                <div className="space-y-2 text-center sm:text-start">
                  <h1 className="border-b py-1 font-outfit text-3xl  font-bold uppercase text-title sm:text-4xl">
                    {partners.section.title}
                  </h1>
                  {partners.section.subtitle ? (
                    <h2 className="font-poppins text-lg font-medium  capitalize text-muted-foreground sm:text-xl">
                      {partners.section.subtitle}
                    </h2>
                  ) : null}
                </div>
                {partners.section.description ? (
                  <div className="w-full space-y-4 sm:flex-1">
                    <p className="text-lg">{partners.section.description}</p>
                  </div>
                ) : null}
              </>
            ) : null}
            {partners.data ? <Partners partners={partners.data} /> : null}
          </section>
        </div>
      ) : null}

      {/* testimonials */}
      {testimonials ? (
        <div className="w-full bg-blue-50/50 p-[5vw]">
          <section id="testimonials" className="mx-auto max-w-7xl space-y-4">
            {testimonials.section ? (
              <>
                <div className="space-y-2 text-center sm:text-start">
                  <h1 className="border-b py-1 font-outfit text-3xl  font-bold uppercase text-title sm:text-4xl">
                    {testimonials.section.title}
                  </h1>
                  {testimonials.section.subtitle ? (
                    <h2 className="font-poppins text-lg font-medium  capitalize text-muted-foreground sm:text-xl">
                      {testimonials.section.subtitle}
                    </h2>
                  ) : null}
                </div>
                {testimonials.section.description ? (
                  <div className="w-full space-y-4 sm:flex-1">
                    <p className="text-lg">
                      {testimonials.section.description}
                    </p>
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
                    className="rounded-lg bg-blue-500 p-3 font-poppins text-primary-foreground transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground"
                  >
                    View all testimonials
                  </Link>
                </div>
              </>
            ) : null}
          </section>
        </div>
      ) : null}
    </main>
  );
}
