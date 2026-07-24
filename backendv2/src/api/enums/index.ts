import { Router } from 'express';

import getManufacturers from './controllers/getManufacturers';

export default Router().get('/manufacturers', getManufacturers);
