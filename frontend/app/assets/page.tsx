import { Suspense } from 'react';
import Asset from '../components/asset';
import Loading from '../components/loading';

export default function AssetsIndex() {
   return (
      <Suspense fallback={<div><Loading/></div>}>
         <Asset />
      </Suspense>
   );
}
