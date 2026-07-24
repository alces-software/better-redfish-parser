'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { GoChevronDown } from 'react-icons/go';
import { FaPlus } from 'react-icons/fa6';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';

export default function Portal() {
   const searchParams = useSearchParams();
   const urlMode = searchParams.get('mode');
   const initialMode = urlMode === 'assets' || urlMode === 'racks' ? urlMode : 'assets';
   const [mode, setMode] = useState(initialMode);
   const assetsQuery = trpc.assets.getAllLatest.useQuery();
   const assets = assetsQuery.data?.body ?? [];
   const racksQuery = trpc.racks.get.useQuery();
   const racks = racksQuery.data?.body ?? [];

   function handleModeChange(nextMode) {
      if (nextMode === mode) {
         return;
      }
      setMode(nextMode);
   }

   return (
      <section>
         <div className="text-center md:text-left">
            <h1 className="font-semibold  text-4xl">System Information Portal</h1>
            <p className="mt-4">View, edit, or delete existing assets, or create a new one.</p>
         </div>

         <div className="mb-8 flex mt-6 justify-center">
            <div className="inline-flex items-center gap-5 rounded-2xl px-4 py-3 backdrop-blur-sm  sm:px-8 sm:py-4">
               <button
                  onClick={() => handleModeChange('assets')}

                  className={[
                     'cursor-pointer border-b-2 pb-2 text-sm font-semibold tracking-wide transition',
                     mode === 'assets'
                        ? 'border-blue-400 text-white'
                        : 'border-transparent text-slate-400 hover:text-white'
                  ].join(' ')}
               >
                  Manage Assets
               </button>

               <button
                  onClick={() => handleModeChange('racks')}

                  className={[
                     'cursor-pointer border-b-2 pb-2 text-sm font-semibold tracking-wide transition',
                     mode === 'racks'
                        ? 'border-blue-400 text-white'
                        : 'border-transparent text-slate-400 hover:text-white'
                  ].join(' ')}
               >
                  Manage Racks
               </button>
            </div>
         </div>

         {mode == 'assets' ? (
            <div className="flex flex-wrap items-start justify-center md:justify-start gap-2 mt-4">
               <div className="relative inline-block  group">
                  <button
                     className="bg-slate-900 font-medium  overflow-auto inline-flex items-center justify-center whitespace-nowrap
                border border-slate-400 gap-2  w-44 h-10 rounded-full"
                  >
                     Select an asset{' '}
                     <GoChevronDown className="h-6 w-6 group-hover:rotate-180 transition duration-350 ease-in-out" />
                  </button>
                  <div className="hidden bg-slate-800 border border-slate-800 rounded-lg group-hover:block">
                     {assets.map((asset) => (
                        <Link
                           key={asset._id}
                           className="block cursor-pointer group-hover:pointer-events-auto pointer-events-none border border-transparent hover:bg-slate-900 rounded-sm"
                           href={`/assets?id=${asset.uuid}`}
                        >
                           {asset.name}{' '}
                        </Link>
                     ))}
                  </div>
               </div>
               <div className="relative">
                  <a
                     href="/new-asset"
                     className="gap-2 inline-flex items-center justify-center w-44 h-10 border bg-white text-slate-900 hover:text-white transition duration-200 font-medium ease-in-out hover:bg-green-800 rounded-full border-green-800"
                  >
                     Create new asset <FaPlus />
                  </a>
               </div>
            </div>
         ) : (
            <div className="flex items-start justify-center md:justify-start gap-2 mt-4">
               <div className="relative inline-block group">
                  <button
                     className="bg-slate-900 font-medium  overflow-auto inline-flex items-center justify-center whitespace-nowrap
                border border-slate-400 gap-2 w-44 h-10 rounded-full"
                  >
                     Select a rack{' '}
                     <GoChevronDown className="h-6 w-6 group-hover:rotate-180 transition duration-350 ease-in-out" />
                  </button>
                  <div className="hidden bg-slate-800 border border-slate-800 rounded-lg group-hover:block">
                     {racks.map((r) => (
                        <Link
                           key={r._id}
                           className="block cursor-pointer group-hover:pointer-events-auto pointer-events-none border border-transparent hover:bg-slate-900 rounded-sm"
                           href={`/racks?id=${r._id}`}
                        >
                           {r.name}{' '}
                        </Link>
                     ))}
                  </div>
               </div>
               <div className="relative">
                  <a
                     href="/new-rack"
                     className="gap-2 inline-flex items-center justify-center w-44 h-10 border bg-white text-slate-900 hover:text-white transition duration-200 font-medium ease-in-out hover:bg-green-800 rounded-full border-green-800"
                  >
                     Create new rack <FaPlus />
                  </a>
               </div>
            </div>
         )}
      </section>
   );
}
