import { Router } from 'express';
import racks from './racks';
import enums from './enums';

export default Router().use('/enums', enums).use('/racks', racks);
