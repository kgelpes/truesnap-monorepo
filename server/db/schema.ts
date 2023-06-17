import { Polybase } from "@polybase/client";
import Wallet from "ethereumjs-wallet";
import { ethPersonalSign } from "@polybase/eth";
import { db } from "./index";

// TODO: Check if user matches the address (auth)
// TODO: Verified image metadata should be read only. Only should be created by admin.
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

@public
collection verifiedImageMetadata {
  id: string;
  name: string;
  image: string;
  imageHash: string;
  creator: users;

  constructor (id: string, name: string, image: string, imageHash: string, creator: users) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.imageHash = imageHash;
    this.creator = creator;
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
