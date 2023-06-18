import { z } from "zod";
import {
  addImageHash,
  db,
  getDBUser,
  createVerifiedImageMetadata,
} from "@truesnap/db";
import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import multer from "multer";
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

import { authMiddleware, authRouter, getUser } from "./auth";
import { NFTStorage, File } from "nft.storage";

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY ?? "";
const NFT_COLLECTION_ADDRESS = process.env.NFT_COLLECTION_ADDRESS ?? "";
const upload = multer({ dest: "temp_uploads/" });

const NFT_STORAGE_TOKEN = process.env.NFT_STORAGE_KEY ?? "";
const nftStorage = new NFTStorage({ token: NFT_STORAGE_TOKEN });

const convertFileToBase64 = (filePath: string) => {
  try {
    // Read file as buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Convert buffer to base64
    const base64String = fileBuffer.toString("base64");

    return base64String;
  } catch (error) {
    console.error(`Error converting file to base64: ${error}`);
    return null;
  }
};

const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const user = await getUser(req);

  return {
    req,
    res,
    user,
  };
};
export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();
const router = t.router;
const publicProcedure = t.procedure;

const userCollection = db.collection("User");

// TODO: Add middleware to check if user is in database
const appRouter = router({
  userAddImageHash: publicProcedure
    .input(
      z.object({
        imageHash: z.string(),
      })
    )
    .mutation(async (opts) => {
      const {
        input,
        ctx: { user },
      } = opts;

      if (!user?.data) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });
      }

      console.log("adding hash", input.imageHash);

      try {
        const response = await addImageHash(user.address, input.imageHash);

        console.log("response", response);

        return response;
      } catch (error) {
        console.log(`Error adding image hash: ${error}`);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error adding image hash",
        });
      }
    }),
});

export type AppRouter = typeof appRouter;

async function main() {
  // express implementation
  const app = express();

  app.use(cors());

  app.use((req, _res, next) => {
    // request logger
    console.log("⬅️ ", req.method, req.path, req.body ?? req.query);

    next();
  });

  app.use("/auth", authRouter);

  app.use(authMiddleware);

  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.get("/", (_req, res) => res.send("hello"));

  app.patch("/uploadPhoto", upload.single("file"), async (req, res) => {
    try {
      const user = await getUser(req);

      if (!user) {
        return res.status(401).json({
          message: "Not authorized.",
        });
      }

      // Receives blob
      if (!req.file) {
        return res.status(400).json({
          message: "No file received.",
        });
      }

      const deleteImage = () => {
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error(`Failed to delete file: ${err}`);
            } else {
              console.log(`Deleted file`);
            }
          });
        }
      };

      // Hashes blob to check if it exists in database
      const hash = createHash("sha256");

      const base64String = convertFileToBase64(req.file.path);

      if (!base64String) {
        deleteImage();
        return res.status(500).json({
          message: "Failed to convert file to base64.",
        });
      }

      hash.update(base64String);
      const fileHash = hash.digest("hex");

      console.log("fileHash", fileHash);

      // Check if it exists in database
      const userData = await getDBUser(user.address);
      const imageHashes = userData?.data?.imageHashes ?? [];

      console.log("imageHashes", imageHashes);
      console.log("includes", imageHashes.includes(fileHash));

      if (imageHashes.includes(fileHash) && req.file) {
        console.log("exists!");
        // Upload blob with nft.storage
        const data = await fs.promises.readFile(req.file.path);
        const cid = await nftStorage.storeBlob(
          new File([data], req.file.originalname)
        );

        // Add CID to polybase
        const record = await createVerifiedImageMetadata(
          `${user.address}-${req.file.originalname}`,
          req.file.originalname,
          cid,
          fileHash,
          user.address
        );

        const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, "mumbai");

        const nftCollection = await sdk.getContract(
          NFT_COLLECTION_ADDRESS,
          "nft-collection"
        );

        const signedPayload = await nftCollection.signature.generate({
          to: user.address,
          metadata: `https://testnet.polybase.xyz/v0/collections/truesnap%2Fdev%2FverifiedImageMetadata/records/${record.data.id}?format=nft`,
        });

        deleteImage();

        return res.status(200).json({
          message: "Image uploaded and verified.",
          signedPayload: JSON.parse(JSON.stringify(signedPayload)),
        });
      } else {
        // Error if does not exist (means photo is not verified)
        console.log("does not exist!");
        deleteImage();
      }
    } catch (error) {
      console.error(`Error uploading photo: ${error}`);
      return res.status(500).json({
        message: "Error uploading photo.",
      });
    }
  });

  app.listen(3333, () => {
    console.log("listening on port 3333");
  });
}

void main();
