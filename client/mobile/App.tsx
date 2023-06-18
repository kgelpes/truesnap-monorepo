import {
  createSecureStorage,
  localWallet,
  metamaskWallet,
  rainbowWallet,
  ThirdwebProvider,
} from "@thirdweb-dev/react-native";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { Mumbai } from "@thirdweb-dev/chains";

import { trpc } from "./trpc";
import Router from "./Router";

const serverUrl = process.env.SERVER_URL || "";

const thirdwebStorage = createSecureStorage("thirdweb");

const App = () => {
  const [queryClient] = useState(new QueryClient());
  const [trpcClient] = useState(
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${serverUrl}/trpc`,
          headers: async () => {
            console.log("getting header");
            const token = await thirdwebStorage?.getItem(
              "auth_token_storage_key"
            );

            return {
              Authorization: `Bearer ${token}`,
            };
          },
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider
          activeChain="mumbai"
          supportedChains={[Mumbai]}
          supportedWallets={[metamaskWallet()]}
          authConfig={{
            domain: `https://${serverUrl}`,
            authUrl: `https://${serverUrl}/auth`,
            secureStorage: thirdwebStorage,
          }}
          queryClient={queryClient}
        >
          <Router />
        </ThirdwebProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
