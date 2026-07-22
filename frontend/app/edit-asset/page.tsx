import { Suspense } from 'react';
import EditAsset from '../components/editAsset';
import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Edit Asset'
};

export default function CreateAsset() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <EditAsset />
      </Suspense>
   );
}
