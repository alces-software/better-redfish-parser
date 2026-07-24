'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

import { trpc } from '@/lib/trpc';

function getTrpcUrl() {
   return process.env.NEXT_PUBLIC_TRPC_URL ?? '/trpc';
}

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
   const [queryClient] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  staleTime: 30_000
               }
            }
         })
   );

   const [trpcClient] = useState(() =>
      trpc.createClient({
         links: [
            httpBatchLink({
               url: getTrpcUrl()
            })
         ]
      })
   );

   return (
      <QueryClientProvider client={queryClient}>
         <trpc.Provider client={trpcClient} queryClient={queryClient}>
            {children}
         </trpc.Provider>
      </QueryClientProvider>
   );
}
