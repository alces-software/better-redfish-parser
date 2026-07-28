'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from './loading';
import { trpc } from '@/lib/trpc';
import { IoSend } from 'react-icons/io5';
import { useEffect } from 'react';

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

    useEffect(() =>{ 
       if (!rackId) {
          router.replace("/")
       }
 
    }, [rackId, router]);

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
      router.refresh();
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
         <div className="justify-center md:justify-start flex items-center">
            <h1 className="font-semibold text-center md:text-left  text-4xl">
               Edit <span className="text-sky-300">{rack.name}</span>
            </h1>
            <Link
               href={`/racks?id=${rackId}`}
               className="ml-4 h-min w-min rounded-full border border-slate-400 bg-slate-800 p-2 transition hover:-translate-y-1 hover:bg-slate-900"
            >
               Cancel
            </Link>
         </div>

         <br />

         <br />

         <form
            id="edit-rack-form"
            onSubmit={handleSubmit}
            className="flex w-full flex-col rounded-lg pb-6 border border-slate-400 bg-slate-900 shadow-2xl drop-shadow-2xl"
         >
            <h2 className="mb-4 rounded-t-lg bg-slate-800 p-4 text-2xl">Rack details</h2>

            <div className="grid grid-cols-2 gap-4 px-4">
               <div>
                  <p className="p-1">Name</p>
                  <input
                     name="name"
                     type="text"
                     defaultValue={rack.name ?? ''}
                     className="w-full rounded-lg border p-2 border-slate-400 text-white"
                     required
                  />
               </div>

               <div>
                  <p className="p-1">Size</p>
                  <input
                     name="size"
                     type="text"
                     defaultValue={rack.size ?? ''}
                     className="w-full rounded-lg border p-2 border-slate-400 text-white"
                     required
                  />
               </div>

               <div className="col-span-2 gap-1">
                  <p className="p-1">Notes</p>
                  <textarea
                     rows={5}
                     name="notes"
                     defaultValue={rack.notes ?? ''}
                     className="w-full rounded-lg border p-1 border-slate-400 text-white"
                  />
               </div>
            </div>
         </form>

         <div className="flex justify-end mt-4">
            <button
               type="submit"
               form="edit-rack-form"
               className="gap-2 inline-flex cursor-pointer items-center justify-center w-fit-content px-4 h-10 border bg-white text-slate-900 hover:text-white transition duration-200 font-medium ease-in-out hover:bg-green-800 rounded-full hover:border-green-800"
            >
               Save Changes <IoSend />
            </button>
         </div>
      </div>
   );
}
