import { Router } from 'express';
import racks from './racks';
import enums from './enums';
import assets from './assets';

export default Router().use('/enums', enums).use('/racks', racks).use('/assets', assets);
