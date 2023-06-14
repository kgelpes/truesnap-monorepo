import {
  localWallet,
  metamaskWallet,
  rainbowWallet,
  ThirdwebProvider,
} from "@thirdweb-dev/react-native";
import React from "react";
import Router from "./Router";

const serverUrl = process.env.SERVER_URL || "";

const App = () => {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      supportedWallets={[metamaskWallet(), rainbowWallet(), localWallet()]}
      authConfig={{
        domain: serverUrl,
        authUrl: `${serverUrl}/auth`,
      }}
    >
      <Router />
    </ThirdwebProvider>
  );
};

export default App;
