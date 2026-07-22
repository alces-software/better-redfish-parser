import { Suspense } from 'react';
import EditAsset from '../components/editAsset';

export default function CreateAsset() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <EditAsset />
      </Suspense>
   );
}
