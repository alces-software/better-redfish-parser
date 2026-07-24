import { router } from '../../base';
import getManufacturers from './controllers/getManufacture';

export default router({
   manufacturers: getManufacturers
});
