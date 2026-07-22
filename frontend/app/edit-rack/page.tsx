import { Suspense } from 'react';
import EditRack from '../components/editRack';
import Loading from '../components/loading';

export default function EditRackPage() {
   return (
      <Suspense fallback={<div><Loading/></div>}>
         <EditRack />
      </Suspense>
   );
}
