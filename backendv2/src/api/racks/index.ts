import { Router } from 'express';

import getRacks from './controllers/getAllRacks';
import getRack from './controllers/getRack';
import deleteRack from './controllers/deleteRack';

export default Router().get('/', getRacks).get('/:id', getRack).delete('/:id', deleteRack);
