import { createCookieSessionStorage } from "@remix-run/node";
import type { Theme } from "~/providers/theme-provider";
import { isTheme } from "~/providers/theme-provider";

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) throw new Error("SESSION_SECRET must be set");

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "___theme__newrup",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get("Cookie"));
  return {
    getTheme: () => {
      const themeValue = session.get("theme");
      return isTheme(themeValue) ? themeValue : null;
    },
    setTheme: (theme: Theme) => session.set("theme", theme),
    commit: () => themeStorage.commitSession(session),
  };
}

export { getThemeSession };
