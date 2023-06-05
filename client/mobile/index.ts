import "@thirdweb-dev/react-native-compat";
import { registerRootComponent } from "expo";

const TextEncodingPolyfill = require("text-encoding");
const BigInt = require("big-integer");

Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
  BigInt: BigInt,
});


import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
