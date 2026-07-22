import { Suspense } from 'react';
import Asset from '../components/asset';

export default function AssetsIndex() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <Asset />
      </Suspense>
   );
}
