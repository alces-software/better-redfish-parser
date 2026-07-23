'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewAsset() {
   const router = useRouter();
   const [racks, setRacks] = useState([]);

   useEffect(() => {
      async function getRacks() {
         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/racks`);
         const data = await res.json();
         setRacks(data.body);
      }
      getRacks();
   }, []);

   async function handleSubmit(event) {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const hardwareFile = formData.get('hardwareData');
      const hardwareData = hardwareFile?.size ? await hardwareFile.text() : '';

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            name: formData.get('name'),
            uuid: formData.get('uuid'),
            rack: formData.get('rack'),
            uPosition: Number(formData.get('uPosition')),
            notes: formData.get('notes'),
            rawJson: hardwareData
         })
      });

      const data = await res.json();

      if (!res.ok) {
         alert(data.message ?? 'Failed to edit asset');
         return;
      }

      router.push(`/assets?id=${data.body.uuid}`);
   }

   return (
      <div>
         <div className="flex relative justify-center md:justify-start items-center">
            <h1 className="font-semibold text-center  text-4xl">New asset</h1>
            <Link
               href="/"
               className="ml-4 h-min w-min rounded-full border border-slate-400 bg-slate-900 p-2 transition hover:-translate-y-1"
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
            <h2 className="mb-4 rounded-t-lg bg-slate-800 p-4 text-2xl">Asset details</h2>

            <div className="pl-2">
               <p className="p-1">Name</p>
               <input
                  name="name"
                  type="text"
                  className="m-1 h-9 w-58 rounded-lg border p-1 text-white"
               />
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1">UUID</p>
               <input
                  name="uuid"
                  type="text"
                  className="m-1 h-9 w-58 rounded-lg border p-1 text-white"
               />
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1">Rack</p>
               <select
                  name="rack"

                  className="m-1 rounded-lg  h-9 w-58 border p-1 text-white"
               >
                  <option value="">Select a rack</option>

                  {racks.map((rack) => (
                     <option key={rack._id} value={rack._id}>
                        {rack.name}
                     </option>
                  ))}
               </select>
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1">U position</p>
               <input
                  name="uPosition"
                  type="text"
                  className="m-1 h-9 w-58 rounded-lg border p-1 text-white"
               />
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1">Notes</p>
               <input
                  name="notes"
                  type="text"
                  className="m-1 rounded-lg h-9 w-58 border p-1 text-white"
               />
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1">Hardware Data</p>
               <input
                  name="hardwareData"
                  type="file"
                  accept="application/json,.json,.txt"
                  className="m-1 cursor-pointer rounded-full w-80  border border-gray-600 bg-gray-600 p-2"
               />
            </div>

            <div className="my-4 flex justify-end px-4">
               <button
                  type="submit"
                  className="cursor-pointer rounded-full border border-blue-700 bg-blue-700 px-2 py-1 transition hover:-translate-y-1"
               >
                  Create Asset
               </button>
            </div>
         </form>
      </div>
   );
}
