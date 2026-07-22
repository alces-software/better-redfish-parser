import { Suspense } from 'react';
import Loading from '../components/loading';
import NewAsset from '../components/newAsset';
import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Create Asset'
};

export default function CreateAsset() {
   return (
      <Suspense fallback={<div> <Loading/></div>}>
         <NewAsset />
      </Suspense>
   );
}
