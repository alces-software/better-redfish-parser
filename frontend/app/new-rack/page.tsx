import { Suspense } from 'react';
import NewRack from '../components/newRack';
import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Create Rack'
};

export default function CreateRack() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <NewRack />
      </Suspense>
   );
}
