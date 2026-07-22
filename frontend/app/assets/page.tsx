import { Suspense } from 'react';
import Asset from '../components/asset';
import Loading from '../components/loading';
import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Asset'
};

export default function AssetsIndex() {
   return (
      <Suspense fallback={<div><Loading/></div>}>
         <Asset />
      </Suspense>
   );
}
