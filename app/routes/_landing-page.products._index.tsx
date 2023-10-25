import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { getAllProducts } from "~/dao/products.server";
import { client } from "~/lib/db.server";
import { ProductCard } from "../components/product-card";

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
    <main className="max-w-8xl mx-auto mt-16 p-[5vw] sm:mt-4">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-2">
          <h1 className="font-outfit text-3xl font-bold uppercase text-title sm:text-4xl">
            {section.title}
          </h1>
          <div className="h-1.5 w-48 bg-blue-400 dark:bg-yellow-400"></div>
          {section.subtitle ? (
            <h2 className="font-poppins text-lg font-medium capitalize text-muted-foreground sm:text-xl">
              {section.subtitle}
            </h2>
          ) : null}
        </div>
        <div className="w-full space-y-4 text-description sm:flex-1">
          <p className="text-lg">{section.description}</p>
        </div>
        {products && products.length > 0 ? (
          <div className="grid gap-4 border-t py-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.title} product={product} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
