import { Suspense } from 'react';
import NewRack from '../components/newRack';
import Loading from '../components/loading';

export default function CreateRack() {
   return (
      <Suspense fallback={<div><Loading/></div>}>
         <NewRack />
      </Suspense>
   );
}
