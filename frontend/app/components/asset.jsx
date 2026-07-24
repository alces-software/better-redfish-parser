'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { trpc } from '@/lib/trpc';

export default function AssetsPage() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const uuId = searchParams.get('id');
   const historyQuery = trpc.assets.getHistory.useQuery(
      { uuid: uuId ?? '' },
      { enabled: Boolean(uuId) }
   );
   const history = historyQuery.data?.body ?? [];
   const [asset, setAsset] = useState(null);
   const [historyIndex, setHistoryIndex] = useState(0);
   const utils = trpc.useUtils();
   const deleteAsset = trpc.assets.delete.useMutation();

   useEffect(() => {
      function syncAsset() {
         setAsset(history[historyIndex]);
      }

      syncAsset();
   }, [history, historyIndex]);

   async function handleDelete() {
      if (!confirm('Are you sure you want to delete this asset?')) {
         return;
      }

      try {
         const res = await deleteAsset.mutateAsync({
            uuid: uuId
         });

         if (!res.success) {
            alert(res.message ?? 'Failed to delete asset');
            return;
         }

         void utils.assets.getAllLatest.invalidate();
         void utils.assets.getHistory.invalidate({ uuid: uuId });
         void utils.assets.getLatest.invalidate({ uuid: uuId });

         router.replace('/');
      } catch (error) {
         alert(error instanceof Error ? error.message : 'Failed to delete asset');
      }
   }

   function handleHistoryChange(nextIndex) {
      const nextAsset = history[nextIndex];

      if (!nextAsset) return;

      setHistoryIndex(nextIndex);
      setAsset(nextAsset);
   }

   const hasPrevious = historyIndex > 0;
   const hasNext = historyIndex < history.length - 1;
   const hardwareData = asset?.rawJson;

   const allDataFields = asset
      ? [
           { title: 'Asset Name', value: asset.name, path: 'name' },
           { title: 'UUID', value: asset.uuid, path: 'uuid' },
           { title: 'Rack Position', value: asset.uPosition, path: 'uPosition' },
           { title: 'Manufacturer', value: asset.manufacturer, path: 'manufacturer' },
           { title: 'Notes', value: asset.notes, path: 'notes' },
           ...(asset.dataFields ?? [])
        ]
      : [];

   return (
      <div>
         <h1 className="font-semibold text-center md:text-left text-4xl">
            System information for <em>{asset?.name ?? uuId}</em>
         </h1>

         <div className="mt-15 flex flex-col items-center justify-center">
            <div className="rounded-lg border border-slate-400 shadow-2xl drop-shadow-2xl bg-slate-900 p-6 mt-5">
               {asset && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-slate-300">
                     {allDataFields.map((field, index) => (
                        <div key={`${field.title}-${index}`}>
                           <span className="text-slate-500 text-sm">{field.title}</span>
                           <p>{field.value}</p>
                        </div>
                     ))}
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

         {asset?.fans.length > 0 && (
            <details className="mt-5 overflow-hidden rounded-xl border border-slate-400 bg-slate-900 shadow-2xl">
               <summary className="cursor-pointer select-none p-6 text-xl font-bold text-white transition hover:bg-slate-800">
                  Fans
               </summary>

               <div className="grid gap-4 border-t border-slate-700 p-6 md:grid-cols-3">
                  {asset.fans.map((fan) => (
                     <div
                        key={fan.name}
                        className="rounded-xl border border-slate-700 bg-slate-900/80 p-5 shadow-lg transition-all duration-300"
                     >
                        <div className="mb-4 flex items-center justify-between">
                           <h3 className="truncate text-lg font-semibold text-white">{fan.name}</h3>

                           <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                 fan.state === 'Enabled'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                              }`}
                           >
                              {fan.state === 'Enabled' ? 'Active' : 'Inactive'}
                           </span>
                        </div>

                        <div className="space-y-3">
                           <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400">
                                 Health
                              </p>
                              <p className="mt-1 font-medium text-green-400">{fan.health}</p>
                           </div>

                           <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400">
                                 Speed
                              </p>
                              <p className="mt-1 text-sm font-medium text-white">
                                 {fan.speed} {fan.units}
                              </p>
                           </div>

                           <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400">
                                 Hot Swappable
                              </p>
                              <p className="mt-1 text-sm font-medium text-white">
                                 {fan.hotPluggable === 'true' ? 'Yes' : 'No'}
                              </p>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </details>
         )}

         {asset?.ethernetInterfaces.length > 0 && (
            <details className="mt-5 overflow-hidden rounded-xl border border-slate-400 bg-slate-900 shadow-2xl">
               <summary className="cursor-pointer select-none p-6 text-xl font-bold text-white transition hover:bg-slate-800">
                  Ethernet Interfaces
               </summary>

               <div className="grid gap-4 border-t border-slate-700 p-6 md:grid-cols-2">
                  {asset.ethernetInterfaces.map((iface) => (
                     <div
                        key={iface.id}
                        className="rounded-xl border border-slate-700 bg-slate-900/80 p-5 shadow-lg transition-all duration-300"
                     >
                        <div className="mb-4 flex items-start justify-between gap-4">
                           <h3 className="truncate text-lg font-semibold text-white">
                              {iface.description}
                           </h3>

                           <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                 iface.health === 'OK'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                              }`}
                           >
                              {iface.health}
                           </span>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                           <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400">Name</p>
                              <p className="mt-1 text-sm font-medium text-white">{iface.id}</p>
                           </div>

                           <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400">
                                 MAC Address
                              </p>
                              <p className="mt-1 font-mono text-sm text-white">
                                 {iface.macAddress}
                              </p>
                           </div>

                           <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400">
                                 Speed
                              </p>
                              <p className="mt-1 text-sm font-medium text-white">
                                 {iface.speedMbps === 'Not found'
                                    ? 'Unknown'
                                    : `${iface.speedMbps} Mbps`}
                              </p>
                           </div>

                           <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400">
                                 Link Status
                              </p>
                              <p
                                 className={`mt-1 text-sm font-medium ${
                                    iface.linkStatus === 'LinkUp'
                                       ? 'text-green-400'
                                       : 'text-yellow-400'
                                 }`}
                              >
                                 {iface.linkStatus}
                              </p>
                           </div>

                           <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400">
                                 Enabled
                              </p>
                              <p
                                 className={`mt-1 text-sm font-medium ${
                                    iface.enabled === 'true' ? 'text-green-400' : 'text-red-400'
                                 }`}
                              >
                                 {iface.enabled === 'true' ? 'Yes' : 'No'}
                              </p>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </details>
         )}

         {asset?.bootOptions.length > 0 && (
            <details className="mt-5 overflow-hidden rounded-xl border border-slate-400 bg-slate-900 shadow-2xl">
               <summary className="cursor-pointer select-none p-6 text-xl font-bold text-white transition hover:bg-slate-800">
                  Boot Options
               </summary>

               <div className="grid gap-4 border-t border-slate-700 p-6 md:grid-cols-2">
                  {asset.bootOptions.map((option) => (
                     <div
                        key={option._id}
                        className="rounded-xl border border-slate-700 bg-slate-900/80 p-5 shadow-lg transition-all duration-300"
                     >
                        <div className="mb-4 flex items-start justify-between gap-4">
                           <div className="min-w-0">
                              <h3 className="truncate text-lg font-semibold text-white">
                                 {option.displayName}
                              </h3>

                              <p className="mt-1 truncate text-sm text-slate-400">
                                 {option.devicePath}
                              </p>
                           </div>

                           <span
                              className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                                 option.enabled === 'true'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                              }`}
                           >
                              {option.enabled === 'true' ? <FaCheckCircle /> : <FaTimesCircle />}

                              {option.enabled === 'true' ? 'Enabled' : 'Disabled'}
                           </span>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                           <div className="rounded-lg border border-slate-700 bg-slate-800/70 p-3">
                              <p className="text-xs uppercase tracking-wide text-slate-400">
                                 Boot ID
                              </p>

                              <p className="mt-1 truncate text-sm font-medium text-white">
                                 {option.id}
                              </p>
                           </div>

                           <div className="rounded-lg border border-slate-700 bg-slate-800/70 p-3">
                              <p className="text-xs uppercase tracking-wide text-slate-400">
                                 Position
                              </p>

                              <p className="mt-1 text-sm font-medium text-white">
                                 #{option.position}
                              </p>
                           </div>

                           <div className="rounded-lg border border-slate-700 bg-slate-800/70 p-3">
                              <p className="text-xs uppercase tracking-wide text-slate-400">
                                 Device Path
                              </p>

                              <p className="mt-1 truncate text-sm font-medium text-white">
                                 {option.devicePath}
                              </p>
                           </div>

                           <div className="rounded-lg border border-slate-700 bg-slate-800/70 p-3">
                              <p className="text-xs uppercase tracking-wide text-slate-400">
                                 Status
                              </p>

                              <p
                                 className={`mt-1 text-sm font-medium ${
                                    option.enabled === 'true' ? 'text-green-400' : 'text-red-400'
                                 }`}
                              >
                                 {option.enabled === 'true' ? 'Available' : 'Disabled'}
                              </p>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </details>
         )}
      </div>
   );
}
