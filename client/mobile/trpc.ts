import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@truesnap/api";

export const trpc = createTRPCReact<AppRouter>();
