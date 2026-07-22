import { Suspense } from 'react';
import EditAsset from '../components/editAsset';
import Loading from '../components/loading';

export default function CreateAsset() {
   return (
      <Suspense fallback={<div> <Loading/></div>}>
         <EditAsset />
      </Suspense>
   );
}
