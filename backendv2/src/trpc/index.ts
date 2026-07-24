import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Setup api endpoints

import { enumsRouter } from './endpoints/enums';

export const appRouter = router({
   enums: enumsRouter
});

export type AppRouter = typeof appRouter;
