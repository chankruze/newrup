import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { getAllProducts } from "~/dao/products.server";
import { client } from "~/lib/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: `Products / ${SITE_TITLE}` },
    { name: "og:title", content: `Products / ${SITE_TITLE}` },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const _db = await client.db(process.env.NEWRUP_DB);

  const section = await _db.collection("sections").findOne({
    title: "Our Products",
  });

  const { products } = await getAllProducts();

  return json({
    section,
    products,
  });
};

export default function ProductsPage() {
  const { section, products } = useLoaderData<typeof loader>();

  if (!section) return null;

  return (
    <main className="max-w-8xl mx-auto p-[5vw]">
      <section className="mx-auto max-w-7xl space-y-6" id="contact">
        <div className="space-y-2">
          <h1 className="font-outfit text-3xl font-bold capitalize sm:text-4xl">
            {section.title}
          </h1>
          {section.subtitle ? (
            <h2 className="text-lg font-medium capitalize  text-muted-foreground sm:text-xl">
              {section.subtitle}
            </h2>
          ) : null}
        </div>
        <div className="w-full space-y-4 sm:flex-1">
          <p className="text-lg">{section.description}</p>
        </div>
        {products.length > 0 ? (
          <div className="grid gap-4 border-t py-6 md:grid-cols-2 lg:grid-cols-3">
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
                  {product.name}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
                <Link
                  to={product._id.toString()}
                  className="mt-4 block cursor-pointer rounded-lg bg-primary py-3 text-center font-semibold text-primary-foreground transition-colors duration-300 ease-in-out hover:bg-primary/80"
                >
                  View Product
                </Link>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
