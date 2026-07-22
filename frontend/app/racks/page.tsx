import { Suspense } from 'react';
import Rack from '../components/rack';

export default function AssetsIndex() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <Rack />
      </Suspense>
   );
}
