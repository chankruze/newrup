import { useRouteLoaderData } from "@remix-run/react";
import type { ProductLoader } from "./desk.products.$id";

export default function ProductPreviewPage() {
  const { product } = useRouteLoaderData<ProductLoader>(
    "routes/desk.products.$id",
  );

  return (
    <div className="grid h-full w-full place-items-center overflow-y-auto p-4">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-lg">
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
    </div>
  );
}
