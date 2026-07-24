import { Router } from 'express';

import getAllRacks from './controllers/getAllRacks';
import getRack from './controllers/getRack';
import deleteRack from './controllers/deleteRack';
import addRack from './controllers/addRack';
import updateRack from './controllers/updateRack';

export default Router()
   .get('/', getAllRacks)
   .get('/:id', getRack)
   .delete('/:id', deleteRack)
   .post('/', addRack)
   .put('/', updateRack);
