import {
  // This example uses a basic Layout component, but you can use any Layout.
  Slot,
} from "expo-router";
const TextEncodingPolyfill = require("text-encoding");
const BigInt = require("big-integer");

Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
  BigInt: BigInt,
});

export default function Layout() {
  // Render the children routes now that all the assets are loaded.
  return <Slot />;
}
