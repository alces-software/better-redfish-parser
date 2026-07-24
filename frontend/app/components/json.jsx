'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Loading from '../components/loading';
import { trpc } from '@/lib/trpc';

function prettyPrintJson(value) {
   if (!value) return 'No Json';

   let json = value;

   for (let index = 0; index < 2; index += 1) {
      if (typeof json !== 'string') break;

      try {
         json = JSON.parse(json);
      } catch {
         return json;
      }
   }

   return typeof json === 'object' ? JSON.stringify(json, null, 2) : String(json);
}

export default function Json() {
   const searchParams = useSearchParams();
   const assetId = searchParams.get('id');
   const version = searchParams.get('version');
   const historyQuery = trpc.assets.getHistory.useQuery(
      { uuid: assetId ?? '' },
      { enabled: Boolean(assetId) }
   );
   const history = historyQuery.data?.body ?? [];
   const asset =
      history.find((entry) => String(entry.version) === String(version)) ?? history[0] ?? null;

   if (!assetId) {
      return (
         <section>
            <Loading />
         </section>
      );
   }

   if (historyQuery.error) {
      return (
         <section>
            <h1 className="font-semibold text-4xl">JSON import</h1>
            <p className="mt-4 text-slate-300">{historyQuery.error.message}</p>
            <Link
               href={`/assets?id=${assetId}`}
               className="mt-6 inline-block rounded-full border border-slate-400 bg-slate-800 p-2 transition hover:-translate-y-1"
            >
               Back
            </Link>
         </section>
      );
   }

   if (historyQuery.isLoading || !asset) {
      return (
         <section>
            <h1 className="font-semibold text-4xl">JSON import</h1>
            <Loading />
         </section>
      );
   }

   return (
      <section>
         <div className="flex items-center">
            <h1 className="font-semibold text-center md:text-left text-4xl">
               JSON import for <em>{asset.name}</em>
            </h1>
            <Link
               href={`/assets?id=${assetId}`}
               className="ml-4 h-min w-min rounded-full border border-slate-400 bg-slate-800 p-2 transition hover:-translate-y-1 hover:bg-slate-900"
            >
               Back
            </Link>
         </div>

         <div className="mt-15 rounded-lg border border-slate-400 bg-slate-900 shadow-2xl drop-shadow-2xl">
            <h2 className="rounded-t-lg bg-slate-800 p-4 text-2xl text-slate-300">
               Version {asset.version}
            </h2>
            <pre className="max-h-[60vh] w-full overflow-auto whitespace-pre-wrap p-4 text-sm text-slate-300">
               {asset.rawJson ? prettyPrintJson(asset.rawJson) : 'No Json'}
            </pre>
         </div>
      </section>
   );
}
