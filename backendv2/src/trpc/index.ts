import { router } from './base';

// Setup api endpoints
import { enumsRouter } from './endpoints/enums';

export const appRouter = router({
   enums: enumsRouter
});

export type AppRouter = typeof appRouter;
