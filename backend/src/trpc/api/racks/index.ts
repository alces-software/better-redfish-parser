import addRack from './controllers/addRack';
import { router } from '../../base';
import deleteRack from './controllers/deleteRack';
import getAllRacks from './controllers/getAllRacks';
import getRack from './controllers/getRack';
import updateRack from './controllers/updateRack';

export default router({
   getById: getRack,
   get: getAllRacks,
   delete: deleteRack,
   update: updateRack,
   add: addRack
});
