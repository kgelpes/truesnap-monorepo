import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@truesnap/api";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "https://truesnap.loca.lt",
    }),
  ],
});

async function server() {
  const users = await trpc.userList.query();
  console.log("Users:", users);
}

export default server;
