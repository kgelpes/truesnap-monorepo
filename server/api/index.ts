import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { db } from "@truesnap/db";
import { publicProcedure, router } from "./trpc";
import cors from "cors";

const userCollection = db.collection("User");


const appRouter = router({
  userCreate: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;

      const user = await userCollection.create([
        input.name,
        input.name, 
      ]);

      return user;
    }),
});

export type AppRouter = typeof appRouter;

createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext() {
    console.log("context 3");
    return {};
  },
}).listen(3333);
