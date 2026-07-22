import { Suspense } from 'react';
import Json from '../components/json';

export default function CreateAsset() {
   return( <Suspense fallback={<div>Loading...</div>}>
      <Json />
   </Suspense>);
}
