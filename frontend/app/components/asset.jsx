import Link from 'next/link';

const assets = [
   {
      id: 1,
      name: 'System1',
      rackPosition: 'U12',
      slots: 2,
      notes: 'Primary server',
      createdOn: '21 Jul 2026',
      updatedOn: '21 Jul 2026'
   }
];

export default function AssetsPage() {
   return (
      <div>
         <h1 className="font-semibold text-4xl">
            System information for <em>Assets</em>
         </h1>

         <div className="mt-15 flex flex-col items-center justify-center">
            <div className="rounded-lg border border-slate-400 shadow-2xl drop-shadow-2xl">
               <table className="text-slate-300">
                  <thead className="bg-slate-800">
                     <tr>
                        <th className="rounded-tl-lg p-4 pl-12">Asset Name</th>
                        <th className="p-4">Rack Position</th>
                        <th className="p-4">Number of Slots</th>
                        <th className="p-4">Notes</th>
                        <th className="p-4">Created on</th>
                        <th className="rounded-tr-lg p-4">Last Updated</th>
                     </tr>
                  </thead>

                  <tbody className="bg-slate-900">
                     {assets.map((asset) => (
                        <tr key={asset.id}>
                           <td className="rounded-bl-lg p-4 pl-12">{asset.name}</td>
                           <td className="p-4">{asset.rackPosition}</td>
                           <td className="p-4">{asset.slots}</td>
                           <td className="p-4">{asset.notes}</td>
                           <td className="p-4">{asset.createdOn}</td>
                           <td className="max-w-90 rounded-br-lg p-4">{asset.updatedOn}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

          

          
         </div>

         <div className="mt-25 grid grid-cols-3 gap-2">
            <div className="col-start-1">
               <Link
                  href="/"
                  className="inline-block rounded-full border border-slate-400 bg-slate-800 p-2 text-white transition hover:-translate-y-1"
               >
                  Back
               </Link>
            </div>

            <div className="col-start-3">
               <div className="flex justify-end gap-2">
                  <Link
                     href="/assets/1/edit"
                     className="inline-flex items-center gap-1 rounded-full border border-slate-400 bg-sky-900 p-2 transition hover:-translate-y-1"
                  >
                     <span>Edit</span>
                     <span>✎</span>
                  </Link>

                  <button
                     type="button"
                     className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-slate-400 bg-red-900 p-2 transition hover:-translate-y-1"
                  >
                     <span>Delete</span>
                     <span>🗑</span>
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}