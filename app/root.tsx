import { cssBundleHref } from "@remix-run/css-bundle";
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import NProgress from "nprogress";
import nProgressStyles from "nprogress/nprogress.css";
import { useEffect } from "react";
import styles from "~/tailwind.css";
import { getThemeSession } from "./lib/theme.server";
import {
  ThemeBody,
  ThemeHead,
  ThemeProvider,
  useTheme,
} from "./providers/theme-provider";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: nProgressStyles },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800;900&family=Outfit:wght@400;500;600;700;900&family=Poppins:ital,wght@0,200;0,400;0,500;0,700;1,100&family=Roboto+Mono&family=Roboto:wght@400;500;700;900&display=swap",
  },
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const themeSession = await getThemeSession(request);

  return json({
    theme: themeSession.getTheme(),
  });
};

function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  let navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "loading") NProgress.start();
    if (navigation.state === "idle") NProgress.done();
  }, [navigation.state]);

  return (
    <html lang="en" className={theme ?? ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ThemeHead ssrTheme={Boolean(data.theme)} />
      </head>
      <body>
        <Outlet />
        <ThemeBody ssrTheme={Boolean(data.theme)} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  );
}
