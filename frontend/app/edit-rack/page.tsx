import { Suspense } from 'react';
import EditRack from '../components/editRack';

export default function EditRackPage() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <EditRack />
      </Suspense>
   );
}