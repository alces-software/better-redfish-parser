'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import { MdDelete, MdModeEdit } from 'react-icons/md';

function formatDate(value) {
   if (!value) return '';
   return new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
   });
}

export default function AssetsPage() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const uuId = searchParams.get('id');
   const [asset, setAsset] = useState(null);
   const [history, setHistory] = useState([]);
   const [historyIndex, setHistoryIndex] = useState(0);

   async function handleDelete() {
      if (!confirm('Are you sure you want to delete this asset?')) {
         return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets/${uuId}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json'
         }
      });

      if (!res.ok) {
         const data = await res.json();
         alert(data.message ?? 'Failed to delete asset');
         return;
      }

      router.push('/');
   }

   useEffect(() => {
      async function getAssetHistory() {
         if (!uuId) return;

         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets/${uuId}/history`);
         const data = await res.json();

         if (!res.ok) {
            alert(data.message ?? 'Failed to load asset history');
            return;
         }

         setHistory(data.body);
         setAsset(data.body[0]);
         setHistoryIndex(0);
      }

      getAssetHistory();
   }, [uuId]);

   function handleHistoryChange(nextIndex) {
      const nextAsset = history[nextIndex];

      if (!nextAsset) return;

      setHistoryIndex(nextIndex);
      setAsset(nextAsset);
   }

   const hasPrevious = historyIndex > 0;
   const hasNext = historyIndex < history.length - 1;
   const hardwareData = asset?.imported_json;

   return (
      <div>
         <h1 className="font-semibold text-4xl">
            System information for <em>{asset?.name ?? uuId}</em>
         </h1>

         <div className="mt-15 flex flex-col items-center justify-center">
            <div className="rounded-lg border border-slate-400 shadow-2xl drop-shadow-2xl bg-slate-900 p-6">
               {asset && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-slate-300">
                     <div>
                        <span className="text-slate-500 text-sm">Asset Name</span>
                        <p>{asset.name}</p>
                     </div>

                     <div>
                        <span className="text-slate-500 text-sm">Rack Position</span>
                        <p>{asset.uPosition}</p>
                     </div>

                     <div>
                        <span className="text-slate-500 text-sm">Number of Slots</span>
                        <p>{asset.version}</p>
                     </div>

                     <div>
                        <span className="text-slate-500 text-sm">Manufacturer</span>
                        <p>{asset.manufacturer}</p>
                     </div>

                     <div>
                        <span className="text-slate-500 text-sm">Model</span>
                        <p>{asset.model}</p>
                     </div>

                     <div>
                        <span className="text-slate-500 text-sm">Serial Number</span>
                        <p>{asset.serial_number}</p>
                     </div>

                     <div>
                        <span className="text-slate-500 text-sm">Processor</span>
                        <p>{asset.processor_name}</p>
                     </div>

                     <div>
                        <span className="text-slate-500 text-sm">Processor Count</span>
                        <p>{asset.processor_count}</p>
                     </div>

                     <div>
                        <span className="text-slate-500 text-sm">Cores</span>
                        <p>{asset.cores}</p>
                     </div>

                     <div>
                        <span className="text-slate-500 text-sm">Memory</span>
                        <p>{asset.memory}</p>
                     </div>

                     <div>
                        <span className="text-slate-500 text-sm">LED Status</span>
                        <p>{asset.led}</p>
                     </div>

                     <div>
                        <span className="text-slate-500 text-sm">Notes</span>
                        <p>{asset.notes}</p>
                     </div>

                     <div className="col-span-full">
                        <span className="text-slate-500 text-sm">Description</span>
                        <p>{asset.description}</p>
                     </div>
                  </div>
               )}
            </div>

            <div className="mt-4 flex items-center justify-center gap-1">
               {hasPrevious ? (
                  <button
                     type="button"
                     onClick={() => handleHistoryChange(historyIndex - 1)}
                     className="cursor-pointer rounded-full border border-slate-400 p-2 hover:bg-slate-300/10"
                  >
                     <GoChevronLeft />
                  </button>
               ) : (
                  <button
                     type="button"
                     className="pointer-events-none rounded-full border p-2 text-white opacity-0"
                  >
                     <GoChevronLeft />
                  </button>
               )}

               {hardwareData ? (
                  <Link
                     href={`/json?id=${uuId}&version=${asset.version}`}
                     className="cursor-pointer rounded-full border border-slate-400 bg-slate-800 p-2 transition hover:bg-slate-900 hover:-translate-y-1"
                  >
                     View Json
                  </Link>
               ) : (
                  <span className="rounded-full border border-slate-400 bg-slate-800 p-2 opacity-50">
                     No Json
                  </span>
               )}

               {hasNext ? (
                  <button
                     type="button"
                     onClick={() => handleHistoryChange(historyIndex + 1)}
                     className="cursor-pointer rounded-full border border-slate-400 p-2 hover:bg-slate-300/10"
                  >
                     <GoChevronRight />
                  </button>
               ) : (
                  <button type="button" className="pointer-events-none rounded-full p-2 opacity-0">
                     <GoChevronRight />
                  </button>
               )}
            </div>

            <p className="mt-3 text-xs text-slate-300">
               {history.length ? historyIndex + 1 : 0} / {history.length}
            </p>
         </div>

         <div className="mt-7 grid grid-cols-3 gap-2">
            <div className="col-start-1">
               <Link
                  href="/?mode=assets"
                  className="inline-block rounded-full border border-slate-400 bg-slate-800 p-2 text-white transition hover:-translate-y-1 hover:bg-slate-900 shadow-lg"
               >
                  Back
               </Link>
            </div>

            <div className="col-start-3">
               <div className="flex justify-end gap-2">
                  <Link
                     href={`/edit-asset?id=${uuId}`}
                     className="inline-flex items-center gap-2 rounded-full border border-slate-400 bg-sky-900 p-2 transition hover:-translate-y-1 hover:bg-sky-700 shadow-lg"
                  >
                     <span>Edit</span>
                     <MdModeEdit size={25} className="text-sky-200" />
                  </Link>

                  <button
                     onClick={handleDelete}
                     type="button"
                     className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-400 bg-red-900 p-2 transition hover:-translate-y-1 hover:bg-red-700 shadow-lg"
                  >
                     <span>Delete</span>
                     <MdDelete size={25} className="text-red-200" />
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
