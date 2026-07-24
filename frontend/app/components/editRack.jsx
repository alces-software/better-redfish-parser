'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from './loading';
import { trpc } from '@/lib/trpc';

export default function EditRack() {
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
   const updateRack = trpc.racks.update.useMutation();
   const rack = rackQuery.data?.body ?? null;

   async function handleSubmit(event) {
      event.preventDefault();

      if (!confirm('Are you sure you want to save these changes?')) {
         return;
      }

      const formData = new FormData(event.currentTarget);

      const res = await updateRack.mutateAsync({
         id: rackId,
         changes: {
            name: formData.get('name'),
            size: Number(formData.get('size')),
            notes: formData.get('notes')
         }
      });

      if (!res.success) {
         alert(res.message ?? 'Failed to edit rack');
         return;
      }

      void utils.racks.get.invalidate();
      void utils.racks.getById.invalidate({ id: rackId });

      router.push(`/racks?id=${rackId}`);
   }

   if (!rackId) {
      return (
         <div>
            <h1 className="font-semibold text-center text-4xl">Edit rack</h1>
            <p className="mt-4 text-slate-300">No rack id was provided.</p>
         </div>
      );
   }

   if (!rack) {
      return (
         <div>
            <h1 className="font-semibold text-4xl">Edit rack</h1>
            <Loading />
         </div>
      );
   }

   return (
      <div>
         <div className=" relative justify-center md:justify-start flex items-center">
            <h1 className="font-semibold text-center md:text-left  text-4xl">
               Edit <em>{rack.name}</em>
            </h1>
            <Link
               href={`/racks?id=${rackId}`}
               className="ml-4 h-min w-min rounded-full border border-slate-400 bg-slate-800 p-2 transition hover:-translate-y-1 hover:bg-slate-900"
            >
               Cancel
            </Link>
         </div>

         <br />
         <hr />
         <br />

         <form
            onSubmit={handleSubmit}
            className="mx-auto flex w-min flex-col rounded-lg border border-slate-400 bg-slate-900 shadow-2xl drop-shadow-2xl"
         >
            <h2 className="mb-4 rounded-t-lg bg-slate-800 p-4 text-2xl">Rack details</h2>

            <div className="pl-2">
               <p className="mx-4 p-1">Name</p>
               <input
                  name="name"
                  type="text"
                  defaultValue={rack.name ?? ''}
                  className="mx-4 rounded-lg border p-1 text-white"
               />
            </div>

            <div className="mt-2 pl-2">
               <p className="mx-4 p-1">Size</p>
               <input
                  name="size"
                  type="text"
                  defaultValue={rack.size ?? ''}
                  className="mx-4 rounded-lg border p-1 text-white"
               />
            </div>

            <div className="mt-2 pl-2">
               <p className="mx-4 p-1">Notes</p>
               <input
                  name="notes"
                  type="text"
                  defaultValue={rack.notes ?? ''}
                  className="mx-4 rounded-lg border p-1 text-white"
               />
            </div>

            <div className="my-4 flex justify-end px-4">
               <button
                  type="submit"
                  className="cursor-pointer rounded-full border border-blue-700 bg-blue-700 px-2 py-1 transition hover:-translate-y-1 hover:bg-blue-900"
               >
                  Save Changes
               </button>
            </div>
         </form>
      </div>
   );
}
