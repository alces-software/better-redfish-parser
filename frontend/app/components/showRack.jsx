import Link from 'next/link';

export default function NewAsset() {
   return (
      <div>
         <div className="flex items-center">
            <h1 className="font-semibold text-4xl">New product</h1>
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

         <form className="mx-auto flex w-min flex-col rounded-lg border border-slate-400 bg-slate-900 shadow-2xl drop-shadow-2xl">
            <h2 className="mb-4 rounded-t-lg bg-slate-800 p-4 text-2xl">Asset details</h2>

            <div className="pl-2">
               <p className="p-1">Name</p>
               <input name="name" type="text" className="m-1 rounded-lg border p-1 text-white" />
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1">Rack position</p>
               <input
                  name="rack_pos"
                  type="text"
                  className="m-1 rounded-lg border p-1 text-white"
               />
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1">Slots</p>
               <input name="slots" type="text" className="m-1 rounded-lg border p-1 text-white" />
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1">Notes</p>
               <input name="notes" type="text" className="m-1 rounded-lg border p-1 text-white" />
            </div>

            <div className="mt-2 pl-2">
               <p className="p-1">JSON file</p>
               <input
                  name="json"
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
                  Create Rack
               </button>
            </div>
         </form>
      </div>
   );
}
