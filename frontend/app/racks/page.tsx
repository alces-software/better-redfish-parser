import { Suspense } from 'react';
import Rack from '../components/rack';
import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Rack'
};

export default function AssetsIndex() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <Rack />
      </Suspense>
   );
}
