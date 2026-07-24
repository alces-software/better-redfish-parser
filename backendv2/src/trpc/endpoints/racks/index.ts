import { router } from '../../base';
import deleteRack from './controllers/deleteRack';
import getAllRacks from './controllers/getAllRacks';
import getRack from './controllers/getRack';

export const enumsRouter = router({
   getById: getRack,
   getAll: getAllRacks,
   delete: deleteRack
});
