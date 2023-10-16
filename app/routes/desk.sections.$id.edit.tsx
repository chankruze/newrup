import { useRouteLoaderData } from "@remix-run/react";
import type { SectionLoader } from "./desk.sections.$id";

export default function ProductEditPage() {
  const { section } = useRouteLoaderData<SectionLoader>(
    "routes/desk.sections.$id"
  );

  return (
    <div className="h-full w-full p-2">
      <pre>{JSON.stringify(section, null, 2)}</pre>
    </div>
  );
}
