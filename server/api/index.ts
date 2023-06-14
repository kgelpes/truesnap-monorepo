import { z } from "zod";
import { createUser, db, getUser } from "@truesnap/db";
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import { ThirdwebAuth } from "@thirdweb-dev/auth/express";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  return {
    req,
    res,
  };
};
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();
const router = t.router;
const publicProcedure = t.procedure;

const userCollection = db.collection("User");

const appRouter = router({
  userCreate: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;

      const user = await userCollection.create([input.name, input.name]);

      return user;
    }),

  auth: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;

      console.log(input);

      return input;
    }),
});

export type AppRouter = typeof appRouter;

// TODO: type env vars
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY ?? "";

async function main() {
  // express implementation
  const app = express();

  app.use(cors());

  const { authRouter, authMiddleware } = ThirdwebAuth({
    domain: process.env.THIRDWEB_AUTH_DOMAIN || "",
    wallet: new PrivateKeyWallet(PRIVATE_KEY),
    callbacks: {
      onLogin: async (address) => {
        const userResponse = await getUser(address);
        const user = userResponse.data;

        if (!user) {
          const response = await createUser(address, []);
          console.log("Created user", response);
        }
      },
    },
  });

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
  app.listen(3333, () => {
    console.log("listening on port 3333");
  });
}

void main();
