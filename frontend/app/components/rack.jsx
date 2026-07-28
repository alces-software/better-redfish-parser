'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useEffect } from 'react';

const colours = ['sky', 'emerald', 'amber'];

export default function RacksPage() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const rackId = searchParams.get('id');
   const utils = trpc.useUtils();
   const rackQuery = trpc.racks.getById.useQuery(
      { id: rackId ?? '' },
      {
         enabled: Boolean(rackId)
      }
   );

   useEffect(() => {
      if (!rackId) {
         router.replace('/');
      }
   }, [rackId, router]);

   const assetsQuery = trpc.assets.getAllLatest.useQuery();
   const allAssets = assetsQuery.data?.body ?? [];
   const assetHistoryQueries = trpc.useQueries((t) =>
      allAssets.map((asset) => t.assets.getHistory({ uuid: asset.uuid }))
   );
   const latestAssets = allAssets.map(
      (asset, index) => assetHistoryQueries[index]?.data?.body?.[0] ?? asset
   );

   const assets = latestAssets.filter((asset) => {
      const assetRackId = asset.rack?._id ?? asset.rack;
      return String(assetRackId) === String(rackId);
   });

   const deleteRack = trpc.racks.delete.useMutation();
   const rack = rackQuery.data?.body ?? null;

   async function handleDelete() {
      if (!confirm('Are you sure you want to delete this rack?')) {
         return;
      }

      if (!rackId) {
         alert('Rack ID is missing');
         return;
      }

      try {
         const res = await deleteRack.mutateAsync({ id: rackId });

         if (!res.success) {
            alert(res.message ?? 'Failed to delete rack');
            return;
         }

         void utils.racks.get.invalidate();
         void utils.racks.getById.invalidate({ id: rackId });

         router.replace('/?mode=racks');
      } catch (error) {
         alert(error instanceof Error ? error.message : 'Failed to delete rack');
      }
   }

   return (
      <div>
         <h1 className="font-semibold text-center md:text-left text-4xl">
            System information for <span className="text-sky-300">{rack?.name ?? rackId}</span>
         </h1>

         {rackQuery.isLoading ? <p className="mt-4 text-slate-300">Loading rack...</p> : null}
         {rackQuery.error ? <p className="mt-4 text-red-300">{rackQuery.error.message}</p> : null}

         {/* <div className="mt-15 flex flex-col items-center justify-center">
            <div className="rounded-lg border border-slate-400 shadow-2xl drop-shadow-2xl">
               <table className="text-slate-300">
                  <thead className="bg-slate-800">
                     <tr>
                        <th className="rounded-tl-lg text-center p-4 pl-12">Name</th>
                        <th className="p-4 text-center">Size</th>
                        <th className="p-4 text-center rounded-tr-lg pr-12">Notes</th>
                     </tr>
                  </thead>

                  <tbody className="bg-slate-900">
                     {rack && !rackQuery.isLoading && !rackQuery.error && (
                        <tr>
                           <td className="rounded-bl-lg p-4 text-center pl-12">{rack.name}</td>
                           <td className="p-4 text-center">{rack.size}</td>

                           <td className="p-4 text-center rounded-br-lg pr-12">{rack.notes}</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div> */}

         <div className="mt-15 flex flex-col items-center justify-center">
            {rack && (
               <div className="grid grid-cols-2 border rounded-lg border-slate-400">
                  <div className="bg-slate-900 border rounded-tl-lg border-transparent p-4 pt-8 text-center ">
                     <strong>Name</strong>
                  </div>
                  <div className="bg-slate-800 p-4 pt-8 border rounded-tr-lg border-transparent text-center">
                     <p>{rack.name}</p>
                  </div>

                  <div className="bg-slate-900 p-4 text-center">
                     <strong>Size</strong>
                  </div>
                  <div className="bg-slate-800 p-4 text-center">
                     <p>{rack.size}</p>
                  </div>

                  <div className="bg-slate-900 p-4 text-center">
                     <strong>Notes</strong>
                  </div>
                  <div className="bg-slate-800 p-4 text-center">
                     <p>{rack.notes}</p>
                  </div>

                  <div className="bg-slate-900 text-center border justify-center flex rounded-bl-lg border-transparent p-4 items-center">
                     <strong>Asset List</strong>
                  </div>

                  <div className="bg-slate-800 max-w-100 flex  flex-wrap gap-1 border rounded-br-lg border-transparent p-4">
                     {assets.length ? (
                        assets.map((asset, index) => (
                           <a
                              href={`/assets?id=${asset.uuid}`}
                              key={asset.id ?? asset.uuid}
                              className={`border w-fit rounded-full mt-1 bg-sky-500/20 text-sky-300 font-medium border-transparent transition hover:-translate-y-1 cursor-pointer border-slate-600 p-2`}
                           >
                              {asset.name}
                           </a>
                        ))
                     ) : (
                        <p className="text-sm text-sky-500">No assets in this rack</p>
                     )}
                  </div>
               </div>
            )}
         </div>
         <div className="mt-25 grid grid-cols-3 gap-2">
            <div className="col-start-1">
               <Link
                  href="/?mode=racks"
                  className="inline-block rounded-full border border-slate-400 bg-slate-800 p-2 text-white transition hover:-translate-y-1 hover:bg-slate-900 shadow-lg"
               >
                  Back
               </Link>
            </div>

            <div className="col-start-3">
               <div className="flex justify-end gap-2">
                  <Link
                     href={`/edit-rack?id=${rackId}`}
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
