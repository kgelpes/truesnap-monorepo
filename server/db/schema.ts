import { Polybase } from "@polybase/client";
import Wallet from "ethereumjs-wallet";
import { ethPersonalSign } from "@polybase/eth";
import { db } from "./index";

// PK, need to establish a PK so we can control updates

const schema = `
@read
collection users {
  id: string;
  imageHashes: string[];

  constructor (id: string, imageHashes: string[]) {
    this.id = id;
    this.imageHashes = imageHashes || [];
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
