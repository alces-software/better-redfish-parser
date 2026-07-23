'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '../components/loading';

function prettyPrintJson(value) {
   if (!value) return '';

   try {
      return JSON.stringify(JSON.parse(value), null, 2);
   } catch {
      return value;
   }
}

export default function Json() {
   const searchParams = useSearchParams();
   const assetId = searchParams.get('id');
   const version = searchParams.get('version');
   const [asset, setAsset] = useState(null);
   const [error, setError] = useState('');

   useEffect(() => {
      async function getJsonImport() {
         if (!assetId) return;

         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets/${assetId}/history`);
         const data = await res.json();

         if (!res.ok) {
            setError(data.message ?? 'Failed to load JSON import');
            return;
         }

         const matchingAsset = data.body.find((entry) => String(entry.version) === String(version));

         setAsset(matchingAsset ?? data.body[0]);
      }

      getJsonImport();
   }, [assetId, version]);

   if (!assetId) {
      return (
         <section>
            <Loading />
         </section>
      );
   }

   if (error) {
      return (
         <section>
            <h1 className="font-semibold text-4xl">JSON import</h1>
            <p className="mt-4 text-slate-300">{error}</p>
            <Link
               href={`/assets?id=${assetId}`}
               className="mt-6 inline-block rounded-full border border-slate-400 bg-slate-800 p-2 transition hover:-translate-y-1"
            >
               Back
            </Link>
         </section>
      );
   }

   if (!asset) {
      return (
         <section>
            <h1 className="font-semibold text-4xl">JSON import</h1>
            <Loading/>
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

         {/* <div className='flex mt-15 mr-4 justify-end gap-2'>
              <Link
               href={`/assets?id=${assetId}`}
               className=" h-min whitespace-nowrap rounded-full border border-slate-400 bg-slate-800 p-2 transition hover:-translate-y-1 hover:bg-slate-900"
            >
               Raw JSON
            </Link>
             <Link
               href={`/assets?id=${assetId}`}
               className=" h-min whitespace-nowrap rounded-full border border-slate-400 bg-slate-800/30 p-2 transition hover:-translate-y-1 hover:bg-slate-900"
            >
               System
            </Link>
               <Link
               href={`/assets?id=${assetId}`}
               className=" h-min whitespace-nowrap rounded-full border border-slate-400 bg-slate-800/30 p-2 transition hover:-translate-y-1 hover:bg-slate-900"
            >
            Processors
            </Link>
               <Link
               href={`/assets?id=${assetId}`}
               className=" h-min w-min rounded-full border border-slate-400 bg-slate-800/30 p-2 transition hover:-translate-y-1 hover:bg-slate-900"
            >
               Memory
            </Link>
              <Link
               href={`/assets?id=${assetId}`}
               className=" h-min w-min rounded-full border border-slate-400 bg-slate-800/30 p-2 transition hover:-translate-y-1 hover:bg-slate-900"
            >
               Network
            </Link>
              <Link
               href={`/assets?id=${assetId}`}
               className=" h-min w-min rounded-full border border-slate-400 bg-slate-800/30 p-2 transition hover:-translate-y-1 hover:bg-slate-900"
            >
               Storage
            </Link>
            
            
            


         </div> */}

         <div className="mt-15 rounded-lg border border-slate-400 bg-slate-900 shadow-2xl drop-shadow-2xl">
            <h2 className="rounded-t-lg bg-slate-800 p-4 text-2xl text-slate-300">
               Version {asset.version}
            </h2>
            <pre className="max-h-[60vh] w-full overflow-auto whitespace-pre-wrap p-4 text-sm text-slate-300">
               {asset.imported_json ? prettyPrintJson(asset.imported_json) : 'No Json'}
            </pre>
         </div>
      </section>
   );
}
