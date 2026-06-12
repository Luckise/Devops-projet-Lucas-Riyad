import React from "react";
import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import CreateFAB from "../components/CreateFAB";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      {
        title: "EAT. Event App",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var stored = localStorage.getItem("eat_theme");
                if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                  document.documentElement.classList.add("dark");
                }
              })();
            `,
          }}
        />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-black/10 dark:selection:bg-white/20">
        <Header />
        {children}
        <BottomNav />
        <CreateFAB />
        {import.meta.env.DEV && <TanStackDevtoolsProxy />}
        <Scripts />
      </body>
    </html>
  );
}

function TanStackDevtoolsProxy() {
  const [TanStackDevtools, setTanStackDevtools] = React.useState<any>(null);
  const [RouterPanel, setRouterPanel] = React.useState<any>(null);
  const [QueryPanel, setQueryPanel] = React.useState<any>(null);

  React.useEffect(() => {
    Promise.all([
      import("@tanstack/react-devtools").then((m) => m.TanStackDevtools),
      import("@tanstack/react-router-devtools").then((m) => m.TanStackRouterDevtoolsPanel),
      import("../integrations/tanstack-query/devtools").then((m) => m.default),
    ]).then(([Devtools, Router, Query]) => {
      setTanStackDevtools(() => Devtools);
      setRouterPanel(() => Router);
      setQueryPanel(() => Query);
    });
  }, []);

  if (!TanStackDevtools) return null;

  return (
    <TanStackDevtools
      config={{ position: "bottom-right" }}
      plugins={[{ name: "Tanstack Router", render: <RouterPanel /> }, QueryPanel]}
    />
  );
}
