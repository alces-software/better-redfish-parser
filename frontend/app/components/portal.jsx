'use client'

import { GoChevronDown } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";

import { useState } from "react";

const assets = ["System1", "Mars", "Cognition"]

const racks = ["AB", "CD", "EF"]

export default function Portal() {
      const [mode, setMode] = useState('assets');

        function handleModeChange(nextMode) {
      if (nextMode === mode) return;

      setMode(nextMode);
  
   }
    return (


        <section>

            
         <div>
            <h1 className="font-semibold text-4xl">System Information Portal</h1>
            <p className="mt-4">View, edit, or delete existing assets, or create a new one.</p>

         </div>

          <div className="mb-8 flex justify-center">
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


         <div className="flex items-start gap-2 mt-4">

            <div className="relative inline-block group">
               <button className="bg-slate-900 font-medium  overflow-auto inline-flex items-center justify-center whitespace-nowrap
                border border-slate-400 gap-2 w-44 h-10 rounded-full">Select an asset <GoChevronDown className="h-6 w-6 group-hover:rotate-180 transition duration-350 ease-in-out"/></button>
               <div className="hidden bg-slate-800 border border-slate-800 rounded-lg group-hover:block">

                {assets.map(asset => 
                 <a key={asset} className="block cursor-pointer group-hover:pointer-events-auto pointer-events-none border border-transparent hover:bg-slate-900 rounded-sm" href="/sysinfos/<%= i.id%>">{asset} </a>


                )}



               

               </div>
            </div>
            <div className="relative">

               <a href="/new-asset" className="gap-2 inline-flex items-center justify-center w-44 h-10 border bg-white text-slate-900 hover:text-white transition duration-200 font-medium ease-in-out hover:bg-green-800 rounded-full border-green-800">
                  Create new asset <FaPlus/>

               </a>

            </div>
         </div>


               ) : (


         <div className="flex items-start gap-2 mt-4">

            <div className="relative inline-block group">
               <button className="bg-slate-900 font-medium  overflow-auto inline-flex items-center justify-center whitespace-nowrap
                border border-slate-400 gap-2 w-44 h-10 rounded-full">Select a rack <GoChevronDown className="h-6 w-6 group-hover:rotate-180 transition duration-350 ease-in-out"/></button>
               <div className="hidden bg-slate-800 border border-slate-800 rounded-lg group-hover:block">

                {racks.map(r => 

                  <a key={r} className="block cursor-pointer group-hover:pointer-events-auto pointer-events-none border border-transparent hover:bg-slate-900 rounded-sm" href="/sysinfos/<%= i.id%>">{r}</a>
                )}




               </div>
            </div>
            <div className="relative">

               <a href="<%= new_sysinfo_path %>" className="gap-2 inline-flex items-center justify-center w-44 h-10 border bg-white text-slate-900 hover:text-white transition duration-200 font-medium ease-in-out hover:bg-green-800 rounded-full border-green-800">
                  Create new rack <FaPlus/>

               </a>

            </div>
         </div>

               )
               }


        
    
      </section>



    )
}
