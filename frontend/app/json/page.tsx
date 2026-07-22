import { Suspense } from 'react';
import Json from '../components/json';
import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'View JSON'
};

export default function CreateAsset() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <Json />
      </Suspense>
   );
}
