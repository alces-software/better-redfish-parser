import { Suspense } from 'react';
import NewAsset from '../components/newAsset';

export default function CreateAsset() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <NewAsset />
      </Suspense>
   );
}
