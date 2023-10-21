import { redirect, type LoaderFunctionArgs } from "@remix-run/node";

export const loader = async (_: LoaderFunctionArgs) => {
  return redirect("edit");
};
