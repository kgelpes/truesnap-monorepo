import {
  localWallet,
  metamaskWallet,
  rainbowWallet,
  ThirdwebProvider,
} from "@thirdweb-dev/react-native";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";

import { trpc } from "./trpc";
import Router from "./Router";

const serverUrl = process.env.SERVER_URL || "";

let token: string;
export function setToken(newToken: string) {
  token = newToken;
}

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${serverUrl}/trpc`,
      headers() {
        return {
          Authorization: `Bearer ${token}`,
        };
      },
    }),
  ],
});

const App = () => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider
          activeChain="mumbai"
          supportedWallets={[metamaskWallet(), rainbowWallet(), localWallet()]}
          authConfig={{
            domain: serverUrl,
            authUrl: `${serverUrl}/auth`,
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
