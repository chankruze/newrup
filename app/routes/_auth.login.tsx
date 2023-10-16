import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { z } from "zod";
import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { ErrorDiv } from "~/components/error-div";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { loginUser } from "~/dao/users.server";
import { createUserSession, getUserId } from "~/lib/session.server";
import { formToJSON } from "~/utils/form-helper.server";
import { safeRedirect } from "~/utils/safe-redirect.server";

export const meta: MetaFunction = () => {
  return [
    { title: `Login / ${SITE_TITLE}` },
    { name: "og:title", content: `Login / ${SITE_TITLE}` },
    { name: "description", content: SITE_DESCRIPTION },
  ];
};

const loginSchema = z.object({
  email: z.string().min(1, "Email must not be empty.").email(),
  password: z.string().min(8, "Password must be 8 characters long."),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  // get the form action and check if it's the login form that is submitting
  const __action = formData.get("__action");

  switch (__action) {
    case "login": {
      // validate form data
      const _validation = loginSchema.safeParse(formToJSON(formData));
      // send error data in response
      if (!_validation.success) {
        const errors = _validation.error.flatten();
        // return validation errors
        return json({
          ok: false,
          error: errors,
        });
      }

      const { email, password } = _validation.data;
      // verify login
      const { ok, id, error } = await loginUser(email, password);

      if (ok && id) {
        const remember = formData.get("remember") === "on";

        return createUserSession({
          request,
          userId: id,
          remember,
          redirectTo,
        });
      }

      return json({ ok: false, error }, { status: 500 });
    }

    default: {
      throw new Error("Unknown action");
    }
  }
};

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: to check if the user still exists in db
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return null;
}

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const { state } = useNavigation();
  const _action = useActionData<typeof action>();

  const busy = state === "submitting";

  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  return (
    <div className="grid h-full w-full md:grid-cols-3 md:gap-0">
      <div className="flex flex-col justify-between gap-8 bg-primary p-8 text-primary-foreground">
        <div>
          <p className="font-montserrat font-medium uppercase tracking-widest">
            {SITE_TITLE}
          </p>
        </div>
        <div className="space-y-4">
          <div className="font-outfit text-4xl font-medium md:text-5xl lg:text-6xl">
            <p>Welcome Back!</p>
          </div>
          <p className="font-poppins lg:text-lg">
            Discover the world's best community of vendors and business owners.
          </p>
        </div>
        <div className="space-y-4 rounded-3xl bg-secondary/10 p-6 font-roboto">
          <p className="line-clamp-3">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nemo
            obcaecati nostrum numquam modi iure dolores dicta! Distinctio itaque
            magnam ullam eaque perspiciatis amet dignissimos nobis!
          </p>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">Steve Smith</p>
              <p className="text-xs">Apple Inc.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="md:col-span-2 md:overflow-y-auto">
        <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center gap-8 p-8">
          <div className="space-y-1">
            <h1 className="font-outfit text-3xl font-medium">
              Get back to your desk 📈
            </h1>
            <p className="font-poppins text-stone-500">
              Login to access the dashboard
            </p>
          </div>
          {/* form error segment */}
          {_action && !_action.ok && typeof _action.error === "string" ? (
            <div className="rounded-lg bg-red-300/20 p-4 text-center text-red-500">
              {_action.error}
            </div>
          ) : null}
          {/* form start */}
          <Form className="w-full space-y-8" method="post">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="i.e. alex@example.com"
              />
              {_action &&
              typeof _action.error === "object" &&
              _action.error.fieldErrors.email ? (
                <ErrorDiv>{_action.error.fieldErrors.email.at(0)}</ErrorDiv>
              ) : null}
            </div>
            <div className="relative grid w-full items-center gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="i.e. Secret@123"
              />
              {_action &&
              typeof _action.error === "object" &&
              _action.error.fieldErrors.password ? (
                <ErrorDiv>{_action.error.fieldErrors.password.at(0)}</ErrorDiv>
              ) : null}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox name="remember" id="remember" />
              <Label htmlFor="remember">Remember me for 7 days</Label>
            </div>
            {/* redirect to */}
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div>
              <Button
                className="w-full"
                type="submit"
                name="__action"
                value="login"
                disabled={busy}
              >
                {busy ? "Processing..." : "Login"}
              </Button>
            </div>
          </Form>
          {/* form end */}
          {/* <div className="text-center font-roboto font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500">
              Register
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export const ErrorBoundary = () => <ErrorBoundaryComponent />;
