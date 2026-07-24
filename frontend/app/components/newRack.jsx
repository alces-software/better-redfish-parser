'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewRack() {
   const router = useRouter();
   const [errorMessage, setErrorMessage] = useState('');
   const createRack = trpc.racks.add.useMutation();

   async function handleSubmit(event) {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      setErrorMessage('');

      try {
         const data = await createRack.mutateAsync({
            name: String(formData.get('name') ?? ''),
            size: Number(formData.get('size')),
            notes: String(formData.get('notes') ?? '')
         });

         router.push(`/racks?id=${data.body._id}`);
      } catch (error) {
         setErrorMessage(error instanceof Error ? error.message : 'Failed to create rack');
      }
   }

   return (
      <div>
         <div className=" relative justify-center md:justify-start flex items-center">
            <h1 className="font-semibold text-center md:text-left  text-4xl">New Rack</h1>
            <Link
               href="/"
               className="ml-4 h-min w-min rounded-full border border-slate-400 bg-slate-800 p-2 transition hover:-translate-y-1 hover:bg-slate-900"
            >
               Cancel
            </Link>
         </div>

         <br />
         <hr />
         <br />

         {errorMessage ? (
            <p className="mb-4 rounded-lg border border-red-500/50 bg-red-950/60 p-3 text-red-200">
               {errorMessage}
            </p>
         ) : null}

         <form
            onSubmit={handleSubmit}
            className="mx-auto flex w-min flex-col rounded-lg border border-slate-400 bg-slate-900 shadow-2xl drop-shadow-2xl"
         >
            <h2 className="mb-4 rounded-t-lg bg-slate-800 p-4 text-2xl">Rack details</h2>

            <div className="pl-2">
               <p className="p-1 mx-4">Name</p>
               <input name="name" type="text" className="mx-4 rounded-lg border p-1 text-white" />
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1 mx-4">Size</p>
               <input name="size" type="text" className="mx-4 rounded-lg border p-1 text-white" />
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1 mx-4">Notes</p>
               <input name="notes" type="text" className="mx-4 rounded-lg border p-1 text-white" />
            </div>

            <div className="my-4 flex justify-end px-4">
               <button
                  type="submit"
                  className="cursor-pointer rounded-full border border-blue-700 bg-blue-700 px-2 py-1 transition hover:-translate-y-1"
               >
                  Create Rack
               </button>
            </div>
         </form>
      </div>
   );
}
