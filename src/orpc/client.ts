import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createRouterClient } from "@orpc/server";

import type { RouterClient } from "@orpc/server";
import type router from "#/orpc/router";

const getORPCClient = createIsomorphicFn()
  .server(async () => {
    const { default: router } = await import("#/orpc/router");
    return createRouterClient(router, {
      context: () => ({
        headers: getRequestHeaders(),
      }),
    });
  })
  .client((): RouterClient<typeof router> => {
    const link = new RPCLink({
      url: `${window.location.origin}/api/rpc`,
    });
    return createORPCClient(link);
  });

export const client: RouterClient<typeof router> = getORPCClient();

export const orpc = createTanstackQueryUtils(client);
