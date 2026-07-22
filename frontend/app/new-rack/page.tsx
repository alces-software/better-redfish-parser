import { Suspense } from 'react';
import NewRack from '../components/newRack';

export default function CreateRack() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <NewRack />
      </Suspense>
   );
}
