import { Suspense } from 'react';
import EditRack from '../components/editRack';
import Loading from '../components/loading';
import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Edit Rack'
};

export default function EditRackPage() {
   return (
      <Suspense fallback={<div><Loading/></div>}>
         <EditRack />
      </Suspense>
   );
}
