'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LuUpload } from "react-icons/lu";
import { FaFileAlt } from "react-icons/fa";
import { IoSend } from "react-icons/io5";


const defaultFields = [
   { id: 1, name: 'Asset name', value: '', path: 'Name' },
   { id: 2, name: 'UUID', value: '', path: 'UUID' },
   { id: 3, name: 'Model', value: '', path: 'Model' },
   { id: 4, name: 'Serial number', value: '', path: 'SerialNumber' },
   { id: 5, name: 'CPU cores', value: '', path: 'ProcessorSummary.CoreCount' },
   { id: 6, name: 'Memory GiB', value: '', path: 'MemorySummary.TotalSystemMemoryGiB' },
   { id: 7, name: 'NIC count', value: '', path: 'NetworkInterfaces.Members.length' },
   { id: 8, name: 'U position', value: 0, path: 'Uposition' }
];

const sections = [
   { key: 'raw', label: 'Raw JSON', path: '' },
   { key: 'system', label: 'System', path: '' },
   { key: 'processors', label: 'Processors', path: 'ProcessorSummary' },
   { key: 'memory', label: 'Memory', path: 'MemorySummary' },
   { key: 'network', label: 'Network', path: 'NetworkInterfaces' },
   { key: 'storage', label: 'Storage', path: 'Storage' },
   { key: 'power', label: 'Power', path: 'Power' },
   { key: 'thermal', label: 'Thermal', path: 'Thermal' }
];

function getValueByPath(data, path) {
   if (!path) return data;

   return path.split('.').reduce((current, key) => {
      if (current === undefined || current === null) return undefined;
      if (key === 'length' && Array.isArray(current)) return current.length;
      if (/^\d+$/.test(key)) return current[Number(key)];

      return current[key];
   }, data);
}

function formatValue(value) {
   if (value === undefined || value === null || value === '') return 'Not found';
   if (typeof value === 'object') return JSON.stringify(value);

   return String(value);
}

function prettyPrint(value) {
   return JSON.stringify(value, null, 2);
}

function findMatchingPaths(data, searchTerm, basePath = '') {
   if (!searchTerm || data === undefined || data === null) return [];

   const matches = [];
   const normalizedSearch = searchTerm.toLowerCase();

   if (Array.isArray(data)) {
      data.forEach((item, index) => {
         const itemPath = basePath ? `${basePath}.${index}` : String(index);
         matches.push(...findMatchingPaths(item, searchTerm, itemPath));
      });

      return matches;
   }

   if (typeof data !== 'object') return matches;

   Object.entries(data).forEach(([key, value]) => {
      const path = basePath ? `${basePath}.${key}` : key;

      if (key.toLowerCase().includes(normalizedSearch)) {
         matches.push({
            path,
            value
         });
      }

      matches.push(...findMatchingPaths(value, searchTerm, path));
   });

   return matches;
}

export default function HardwareFieldsDemo() {
   const [jsonText, setJsonText] = useState(prettyPrint(''));
   const [activeSection, setActiveSection] = useState('raw');
   const [fields, setFields] = useState(defaultFields);
   const [fieldLabel, setFieldLabel] = useState('');
   const [fieldPath, setFieldPath] = useState('');
   const [pathSearch, setPathSearch] = useState('');
   const [fileName, setFileName] = useState(null);
   const [editingFieldId, setEditingFieldId] = useState(null);
   const [racks, setRacks] = useState([]);
   const [selectedRack, setSelectedRack] = useState('');
   const [notes, setNotes] = useState('');

   const { parsedJson, parseError } = useMemo(() => {
      try {
         return {
            parsedJson: JSON.parse(jsonText),
            parseError: ''
         };
      } catch {
         return {
            parsedJson: null,
            parseError: 'JSON could not be parsed'
         };
      }
   }, [jsonText]);

   function isSearchableValue(value) {
      return !Array.isArray(value) && (value === null || typeof value !== 'object');
   }

   const selectedSection = sections.find((section) => section.key === activeSection);
   const sectionData = parsedJson ? getValueByPath(parsedJson, selectedSection?.path ?? '') : null;
   const pathMatches = parsedJson
      ? findMatchingPaths(parsedJson, pathSearch)
         .filter((match) => isSearchableValue(match.value))
         .slice(0, 12)
      : [];
   const uploadedFile = Boolean(fileName)

   useEffect(() => {
      async function getRacks() {
         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/racks`);
         const data = await res.json();
         setRacks(data.body);
      }

      getRacks();
   }, []);

   async function handleFileChange(event) {
      const file = event.target.files?.[0];
      if (!file) return;

      setFileName(file.name);
      setJsonText(await file.text());
   }

   function handleAddField(event) {
      event.preventDefault();

      if (!fieldLabel || !fieldPath) return;

      setFields((currentFields) => [
         ...currentFields,
         {
            id: Date.now(),
            name: fieldLabel,
            value: parsedJson ? getValueByPath(parsedJson, fieldPath) : '',
            path: fieldPath
         }
      ]);
      setFieldLabel('');
      setFieldPath('');
   }

   function handleRemoveField(fieldId) {
      setFields((currentFields) => currentFields.filter((field) => field.id !== fieldId));
      if (editingFieldId === fieldId) setEditingFieldId(null);
   }

   function getFieldValue(field) {
      if (field.edited) return String(field.value ?? '');
      if (field.value !== undefined && field.value !== '') return String(field.value);
      if (!parsedJson) return 'Not found';

      return formatValue(getValueByPath(parsedJson, field.path));
   }

   function handleFieldValueChange(fieldId, value) {
      setFields((currentFields) =>
         currentFields.map((field) =>
            field.id === fieldId ? { ...field, value, edited: true } : field
         )
      );
   }

   function handleEditField(field) {
      if (editingFieldId !== field.id) {
         setFields((currentFields) =>
            currentFields.map((currentField) =>
               currentField.id === field.id
                  ? { ...currentField, previousValue: getFieldValue(field) }
                  : currentField
            )
         );
         setEditingFieldId(field.id);
         return;
      }

      const previousValue =
         field.previousValue ??
         (parsedJson ? formatValue(getValueByPath(parsedJson, field.path)) : 'Not found');
      const nextValue = field.value === '' ? previousValue : String(field.value ?? '');

      setFields((currentFields) =>
         currentFields.map((currentField) =>
            currentField.id === field.id
               ? { ...currentField, value: nextValue, previousValue: nextValue, edited: true }
               : currentField
         )
      );

      setEditingFieldId(null);
   }

   function handleCreateAsset() {

      const assetNameField = fields.find((f) => f.name === 'Asset name');
      const uuidField = fields.find((f) => f.name === 'UUID');
      const uPosField = fields.find((f) => f.name === 'U position');

      const assetName = assetNameField ? getFieldValue(assetNameField) : '';
      const uuID = uuidField ? getFieldValue(uuidField) : '';
      const uPos = uPosField ? getFieldValue(uPosField) : '';

      const collectedFields = fields
         .filter((field) => field.name !== 'Asset name' && field.name !== 'UUID' && field.name !== 'U position')
         .map((field) => ({
            name: field.name,
            value: getFieldValue(field),
            path: field.path
         }));

      const assetDetails = {
         name: assetName,
         uuid: uuID,
         uPosition: uPos,
         rack: selectedRack,
         notes,
         fields: collectedFields
      };

      console.log(assetDetails);
      // console.log(collectedFields);
      // console.log(fields);
   }

   return (
      <section>
         <div className="flex items-center">
            <h1 className="font-semibold text-center md:text-left text-4xl">
               Create new asset
            </h1>
            <Link
               href="/"
               className="ml-4 h-min w-min rounded-full border border-slate-400 bg-slate-800 p-2 transition hover:-translate-y-1 hover:bg-slate-900"
            >
               Back
            </Link>
         </div>

         <div className="mt-15 flex flex-wrap items-center gap-2">
            <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-800 hover:border-blue bg-white px-4 text-md font-semibold text-slate-900 transition duration-200 ease-in-out  hover:bg-blue-800 hover:text-white">
               Upload file <LuUpload />
               <input
                  type="file"
                  accept="application/json,.json,.txt"
                  onChange={handleFileChange}
                  className="sr-only"
               />
            </label>
            {fileName && <span className="text-md flex items-center gap-1 text-slate-300">{fileName}<FaFileAlt /></span>}
         </div>

         <div className="mt-4 rounded-lg border border-slate-400 bg-slate-900 p-4 shadow-2xl drop-shadow-2xl">
            <div className="grid gap-4 md:grid-cols-2">
               <label className="block">
                  <span className="block p-1 text-slate-300">Rack</span>
                  <select
                     name="rack"
                     value={selectedRack}
                     onChange={(event) => setSelectedRack(event.target.value)}
                     className="m-1 h-9 w-full rounded-lg border p-1 text-white"
                     required
                  >
                     <option value="">Select a rack</option>

                     {racks.map((rack) => (
                        <option key={rack._id} value={rack._id}>
                           {rack.name}
                        </option>
                     ))}
                  </select>
               </label>

               <label className="block">
                  <span className="block p-1 text-slate-300">Notes</span>
                  <input
                     name="notes"
                     type="text"
                     value={notes}
                     onChange={(event) => setNotes(event.target.value)}
                     className="m-1 h-9 w-full rounded-lg border p-1 text-white"
                  />
               </label>
            </div>
         </div>

         {uploadedFile ? (

            <>



               <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr]">

                  <div className="min-w-0 max-w-3xl overflow-hidden rounded-lg border border-slate-400 bg-slate-900 shadow-2xl drop-shadow-2xl">




                     <div className="rounded-t-lg bg-slate-800 p-4">
                        <h2 className="text-2xl text-slate-300">Imported Redfish JSON</h2>

                     </div>

                     <div className="flex flex-wrap gap-2 p-4">
                        {sections.map((section) => (
                           <button
                              key={section.key}
                              type="button"
                              onClick={() => setActiveSection(section.key)}
                              className={[
                                 'rounded-full border border-slate-400 px-3 py-2 text-sm transition hover:-translate-y-1',
                                 activeSection === section.key
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-slate-800/30 text-slate-300 hover:bg-slate-900'
                              ].join(' ')}
                           >
                              {section.label}
                           </button>
                        ))}
                     </div>

                     {parseError ? (
                        <p className="p-4 text-slate-300">{parseError}</p>
                     ) : (
                        <pre className="max-h-[60vh] max-w-full overflow-auto whitespace-pre-wrap break-words p-4 text-sm text-slate-300">
                           {sectionData === undefined ? 'Not found' : prettyPrint(sectionData)}
                        </pre>
                     )}
                  </div>

                  <div className="rounded-lg border border-slate-400 bg-slate-900 shadow-2xl drop-shadow-2xl">
                     <h2 className="rounded-t-lg bg-slate-800 p-4 text-2xl text-slate-300">Tracked fields</h2>

                     <div className="border-b border-slate-700 p-4">
                        <label className="block">
                           <span className="block p-1 text-slate-300">Search keys</span>
                           <input
                              value={pathSearch}
                              onChange={(event) => setPathSearch(event.target.value)}
                              placeholder="SerialNumber"
                              className="m-1 h-9 w-full rounded-lg border p-1 text-white placeholder:text-slate-500"
                           />
                        </label>

                        {pathSearch && (
                           <div className="mt-3 max-h-56 overflow-auto rounded-lg border border-slate-700 bg-slate-950">
                              {pathMatches.length ? (
                                 pathMatches.map((match) => (
                                    <button
                                       key={match.path}
                                       type="button"
                                       onClick={() => {
                                          setFieldPath(match.path);
                                          setFieldLabel(match.path.split('.').at(-1) ?? '');
                                          setPathSearch('');
                                       }}
                                       className="block w-full border-b border-slate-800 cursor-pointer p-2 text-left text-sm transition hover:bg-slate-900"
                                    >
                                       <span className="block text-slate-300">{match.path}</span>
                                       <span className="mt-1 block truncate text-xs text-slate-500">
                                          {formatValue(match.value)}
                                       </span>
                                    </button>
                                 ))
                              ) : (
                                 <p className="p-2 text-sm text-slate-500">No matching keys found</p>
                              )}
                           </div>
                        )}
                     </div>

                     <form onSubmit={handleAddField} className="border-b border-slate-700 p-4">
                        <label className="block">
                           <span className="block p-1 text-slate-300">Label</span>
                           <input
                              value={fieldLabel}
                              onChange={(event) => setFieldLabel(event.target.value)}
                              className="m-1 h-9 w-full rounded-lg border p-1 text-white"
                           />
                        </label>

                        <label className="mt-2 block">
                           <span className="block p-1 text-slate-300">JSON path</span>
                           <input
                              value={fieldPath}
                              onChange={(event) => setFieldPath(event.target.value)}
                              placeholder="ProcessorSummary.CoreCount"
                              className="m-1 h-9 w-full rounded-lg border p-1 text-white placeholder:text-slate-500"
                           />
                        </label>

                        <button
                           type="submit"
                           className="mt-4 cursor-pointer rounded-full border border-blue-700 bg-blue-700 px-3 py-2 text-sm transition hover:-translate-y-1 hover:bg-blue-900 hover:border-blue-900"
                        >
                           Add Field
                        </button>
                     </form>

                     <div className="divide-y divide-slate-700">
                        {fields.map((field) => (
                           <div key={field.id} className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                 <div>
                                    <p className="font-medium text-slate-300">{field.name}</p>
                                    <p className="mt-1 text-xs text-slate-500">{field.path}</p>
                                 </div>
                                 <div className="flex gap-2">
                                    <button
                                       type="button"
                                       onClick={() => handleEditField(field)}
                                       className="rounded-full border border-slate-400 px-2 py-1 text-xs text-slate-300 transition hover:-translate-y-1 hover:bg-slate-800"
                                    >
                                       {editingFieldId === field.id ? 'Save' : 'Edit'}
                                    </button>
                                    <button
                                       type="button"
                                       onClick={() => handleRemoveField(field.id)}
                                       className="rounded-full border border-slate-400 px-2 py-1 text-xs text-slate-300 transition hover:-translate-y-1 hover:bg-red-900"
                                    >
                                       Remove
                                    </button>
                                 </div>
                              </div>
                              {editingFieldId === field.id ? (
                                 <input
                                    value={getFieldValue(field)}
                                    onChange={(event) =>
                                       handleFieldValueChange(field.id, event.target.value)
                                    }
                                    className="mt-3 h-9 w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-sm text-slate-300"
                                 />
                              ) : (
                                 <p className="mt-3 rounded-lg bg-slate-800 p-2 text-sm text-slate-300">
                                    {getFieldValue(field)}
                                 </p>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
               <div className='flex justify-end mt-4 '>

                  <button
                     type="button"
                     onClick={handleCreateAsset}
                     className="gap-2 inline-flex cursor-pointer items-center justify-center w-fit-content px-4 h-10 border bg-white text-slate-900 hover:text-white transition duration-200 font-medium ease-in-out hover:bg-green-800 rounded-full border-green-800"
                  >
                     Create asset <IoSend />
                  </button>
               </div>
            </>






         ) : (

            <>

               <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr]">

                  <div className="rounded-lg border border-slate-400 bg-slate-900 shadow-2xl drop-shadow-2xl">




                     <div className="rounded-t-lg bg-slate-800 p-4">
                        <h2 className="text-2xl text-slate-300">Imported Redfish JSON</h2>

                     </div>

                     <div className="flex min-h-64 items-center justify-center">
                        <p className="text-lg text-slate-300">Upload a file to continue</p>
                     </div>






                  </div>

                  <div className="rounded-lg border border-slate-400 bg-slate-900 shadow-2xl drop-shadow-2xl">
                     <h2 className="rounded-t-lg bg-slate-800 p-4 text-2xl text-slate-300">Tracked fields</h2>

                     <div className="border-b border-slate-700 p-4">
                        <label className="block">
                           <span className="block p-1 text-slate-300">Search keys</span>
                           <input
                              value={pathSearch}
                              onChange={(event) => setPathSearch(event.target.value)}
                              placeholder="SerialNumber"
                              className="m-1 h-9 w-full rounded-lg border p-1 text-white placeholder:text-slate-500"
                           />
                        </label>


                     </div>

                     <form onSubmit={handleAddField} className="border-b border-slate-700 p-4">
                        <label className="block">
                           <span className="block p-1 text-slate-300">Label</span>
                           <input
                              value={fieldLabel}
                              onChange={(event) => setFieldLabel(event.target.value)}
                              className="m-1 h-9 w-full rounded-lg border p-1 text-white"
                           />
                        </label>

                        <label className="mt-2 block">
                           <span className="block p-1 text-slate-300">JSON path</span>
                           <input
                              value={fieldPath}
                              onChange={(event) => setFieldPath(event.target.value)}
                              placeholder="ProcessorSummary.CoreCount"
                              className="m-1 h-9 w-full rounded-lg border p-1 text-white placeholder:text-slate-500"
                           />
                        </label>
                        <button
                           type="submit"
                           disabled
                           className="mt-4 rounded-full border border-gray-700 bg-gray-700 px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50"
                        >
                           Add Field
                        </button>
                     </form>
                  </div>

               </div>

               <div className='flex justify-end mt-4 '>

                  <button
                     disabled

                     className="gap-2 disabled:cursor-not-allowed inline-flex items-center justify-center w-fit-content px-4 h-10 border border-gray-700 bg-gray-700 disabled:opacity-[0.6] font-medium rounded-full"
                  >
                     Create asset <IoSend />
                  </button>
               </div>
            </>






         )}


      </section>
   );
}
