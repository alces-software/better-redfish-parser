import { router } from '../../base';
import getManufacturers from './controllers/getManufacture';

export const enumsRouter = router({
   manufacturers: getManufacturers
});
