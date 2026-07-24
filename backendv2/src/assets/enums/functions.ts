import { Manufacturers } from './enums';

export function getManufacturers() {
   return Object.entries(Manufacturers).map(([name, value]) => ({
      name,
      value
   }));
}
