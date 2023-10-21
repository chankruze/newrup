import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { format } from "date-fns";
import { MoreVertical, Trash, X } from "lucide-react";
import { ActionButton } from "~/components/action-button";
import { ActionTabButton } from "~/components/action-tab-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SITE_TITLE } from "~/consts";
import { deleteProduct, getProduct } from "~/dao/products.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const __action = formData.get("__action");

  switch (__action) {
    case "delete": {
      const { ok, error } = await deleteProduct(params.id as string);

      if (ok) return redirect(`/desk/products`);

      return json({ ok: false, error });
    }

    default: {
      throw new Error("Unknown action");
    }
  }
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (id) {
    const { product } = await getProduct(id);

    if (product) return json({ product });

    return json({ product: null });
  }

  return json({ product: null });
};

export type ProductLoader = typeof loader;

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.product?.title} / ${SITE_TITLE}` },
    {
      property: "og:title",
      content: `${data?.product?.title} / ${SITE_TITLE}`,
    },
    { name: "description", content: `${data?.product?.description}` },
  ];
};

export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const back = () => navigate("/desk/products");

  const _delete = () => submit({ __action: "delete" }, { method: "post" });

  if (product) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="space-y-1 border-b p-2">
          <div className="flex items-center justify-between">
            <p className="line-clamp-1 font-outfit font-medium">
              {product.title}
            </p>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <ActionButton tooltip="close" icon={MoreVertical} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={_delete}>
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ActionButton tooltip="close" icon={X} action={back} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              <ActionTabButton to="edit" label="Editor" />
              <ActionTabButton to="preview" label="Preview" />
            </div>
            <div className="text-sm font-medium">
              Updated:{" "}
              {format(new Date(product.updatedAt), "dd-MM-yyyy hh:mm a")}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full w-full place-content-center p-2">
      <p>Product not found!</p>
    </div>
  );
}
