import {
  localWallet,
  metamaskWallet,
  rainbowWallet,
  ThirdwebProvider,
} from "@thirdweb-dev/react-native";
import React from "react";
import Router from "./Router";
import "@thirdweb-dev/react-native-compat";

const TextEncodingPolyfill = require("text-encoding");
const BigInt = require("big-integer");

Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
  BigInt: BigInt,
});

const App = () => {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      supportedWallets={[metamaskWallet(), rainbowWallet(), localWallet()]}
    >
      <Router />
    </ThirdwebProvider>
  );
};

export default App;
