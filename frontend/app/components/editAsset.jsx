'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditAsset() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const assetId = searchParams.get('id');

   const [asset, setAsset] = useState(null);

   useEffect(() => {
      async function getAsset() {
         if (!assetId) return;

         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets/${assetId}`);
         const data = await res.json();
         setAsset(data.body);
      }
      getAsset();
   }, [assetId]);

   async function handleSubmit(event) {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const hardwareFile = formData.get('hardwareData');
      const hardwareData = hardwareFile?.size ? await hardwareFile.text() : '';

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets/${assetId}`, {
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
            hardwareData
         })
      });

      const data = await res.json();

      if (!res.ok) {
         alert(data.message ?? 'Failed to edit asset');
         return;
      }

      setAsset(data.body);
      router.push(`/assets?id=${data.body.uuid}`);
   }

   if (!assetId) {
      return (
         <div>
            <h1 className="font-semibold text-4xl">Edit asset</h1>
            <p className="mt-4 text-slate-300">No asset id was provided.</p>
         </div>
      );
   }

   if (!asset) {
      return (
         <div>
            <h1 className="font-semibold text-4xl">Edit asset</h1>
            <p className="mt-4 text-slate-300">Loading asset...</p>
         </div>
      );
   }

   return (
      <div>
         <div className="flex items-center">
            <h1 className="font-semibold text-4xl">
               Edit <em>{asset?.name ?? assetId}</em>
            </h1>
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
                  defaultValue={asset?.name ?? ''}
                  className="m-1 rounded-lg border p-1 text-white"
               />
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1">UUID</p>
               <input
                  name="uuid"
                  type="text"
                  defaultValue={asset?.uuid ?? ''}
                  className="m-1 rounded-lg border p-1 text-white"
               />
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1">Rack</p>
               <input
                  name="rack"
                  type="text"
                  defaultValue={asset?.rack?._id ?? asset?.rack ?? ''}
                  className="m-1 rounded-lg border p-1 text-white"
               />
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1">U position</p>
               <input
                  name="uPosition"
                  type="text"
                  defaultValue={asset?.uPosition ?? ''}
                  className="m-1 rounded-lg border p-1 text-white"
               />
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1">Notes</p>
               <input
                  name="notes"
                  type="text"
                  defaultValue={asset?.notes ?? ''}
                  className="m-1 rounded-lg border p-1 text-white"
               />
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1">Hardware Data</p>
               <input
                  name="hardwareData"
                  type="file"
                  accept="application/json,.json,.txt"
                  className="m-1 cursor-pointer rounded-full border border-gray-600 bg-gray-600 p-2"
               />
            </div>

            <div className="my-4 flex justify-end px-4">
               <button
                  type="submit"
                  className="cursor-pointer rounded-full border border-blue-700 bg-blue-700 px-2 py-1 transition hover:-translate-y-1"
               >
                  Edit Asset
               </button>
            </div>
         </form>
      </div>
   );
}
