import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { getProduct } from "~/dao/products.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { product } = await getProduct(params.id as string);

  return json({
    product,
  });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.product?.title} / ${SITE_TITLE}` },
    { name: "og:title", content: `${data?.product?.title} / ${SITE_TITLE}` },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

export default function ProductsPage() {
  const { product } = useLoaderData<typeof loader>();

  if (!product) return null;

  return (
    <main className="max-w-8xl mx-auto p-[5vw]">
      <section className="mx-auto max-w-7xl space-y-6" id="contact">
        <h1 className="font-outfit text-3xl font-bold capitalize sm:text-4xl">
          {product.title}
        </h1>
        <div className="flex flex-wrap justify-between gap-4">
          <div className="w-full space-y-4 sm:flex-1">
            <p className="max-w-lg text-xl text-zinc-500 dark:text-zinc-400">
              {product.description}
            </p>
          </div>
          <div className="grid w-full place-items-end sm:flex-1">
            <img src={product.image} alt={`${product.name}`} />
          </div>
        </div>
      </section>
    </main>
  );
}
