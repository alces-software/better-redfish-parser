'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';

export default function RacksPage() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const rackId = searchParams.get('id');
   const [rack, setRack] = useState(null);

   async function handleDelete() {
      if (!confirm('Are you sure you want to delete this rack?')) {
         return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/racks/${rackId}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json'
         }
      });

      if (!res.ok) {
         const data = await res.json();
         alert(data.message ?? 'Failed to delete rack');
         return;
      }

      router.push('/?mode=racks');
   }

   useEffect(() => {
      async function getRack() {
         if (!rackId) return;

         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/racks/${rackId}`);
         const data = await res.json();
         setRack(data.body);
      }

      getRack();
   }, [rackId]);

   return (
      <div>
         <h1 className="font-semibold text-4xl">
            System information for <em>{rack?.name ?? rackId}</em>
         </h1>

         <div className="mt-15 flex flex-col items-center justify-center">
            <div className="rounded-lg border border-slate-400 shadow-2xl drop-shadow-2xl">
               <table className="text-slate-300">
                  <thead className="bg-slate-800">
                     <tr>
                        <th className="rounded-tl-lg p-4 pl-12">Name</th>
                        <th className="p-4">Size</th>

                        <th className="p-4 rounded-tr-lg">Notes</th>
                     </tr>
                  </thead>

                  <tbody className="bg-slate-900">
                     {rack && (
                        <tr>
                           <td className="rounded-bl-lg p-4 pl-12">{rack.name}</td>
                           <td className="p-4">{rack.size}</td>

                           <td className="p-4 rounded-br-lg">{rack.notes}</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
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
