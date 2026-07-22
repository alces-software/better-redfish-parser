import { Suspense } from 'react';
import Rack from '../components/rack';
import Loading from '../components/loading';

export default function AssetsIndex() {
   return (
      <Suspense fallback={<div><Loading/></div>}>
         <Rack />
      </Suspense>
   );
}
