import { router } from './base';

// Setup api endpoints
import enumsRouter from './api/enums';
import racksRouter from './api/racks';
import assetsRouter from './api/assets';

export const appRouter = router({
   enums: enumsRouter,
   racks: racksRouter,
   assets: assetsRouter
});

export type AppRouter = typeof appRouter;
