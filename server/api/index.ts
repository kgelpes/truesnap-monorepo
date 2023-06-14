import { z } from "zod";
import { addImageHash, db } from "@truesnap/db";
import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import { authMiddleware, authRouter, getUser } from "./auth";

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

      return addImageHash(user.address, input.imageHash);
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

  app.get("/secret", async (req, res) => {
    const user = await getUser(req);

    if (!user) {
      return res.status(401).json({
        message: "Not authorized.",
      });
    }

    return res.status(200).json({
      message: "This is a secret... don't tell anyone.",
    });
  });

  app.listen(3333, () => {
    console.log("listening on port 3333");
  });
}

void main();
