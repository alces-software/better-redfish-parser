import { Suspense } from 'react';
import Portal from '../app/components/portal';
import Loading from './components/loading';

export default function Home() {
   return (
      <Suspense fallback={<Loading />}>
         <Portal />
      </Suspense>
   );
}
