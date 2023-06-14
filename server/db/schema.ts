import { Polybase } from "@polybase/client";
import Wallet from "ethereumjs-wallet";
import { ethPersonalSign } from "@polybase/eth";
import { db } from "./index";

// TODO: Check if user matches the address (auth)
const schema = `
@public
collection users {
  id: string;
  imageHashes: string[];

  constructor (id: string, imageHashes: string[]) {
    this.id = id;
    this.imageHashes = imageHashes || [];
  }

  addImageHash(imageHash: string) {
    this.imageHashes.push(imageHash);
  }
}
`;

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY ?? "";

async function load() {
  db.signer((data) => {
    const wallet = Wallet.fromPrivateKey(Buffer.from(PRIVATE_KEY, "hex"));
    return {
      h: "eth-personal-sign",
      sig: ethPersonalSign(wallet.getPrivateKey(), data),
    };
  });

  if (!PRIVATE_KEY) {
    throw new Error("No private key provided");
  }

  try {
    await db.applySchema(schema);
  } catch (e) {
    return e;
  }

  return "Schema loaded";
}

load().then(console.log).catch(console.error);
