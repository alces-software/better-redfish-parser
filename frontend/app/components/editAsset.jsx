'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { FaChevronDown } from 'react-icons/fa6';
import { FaFileAlt } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { LuUpload } from 'react-icons/lu';
import Loading from './loading';

const newImportFields = [
   { id: 1, name: 'Asset name', value: '', path: 'Name', locked: true },
   { id: 2, name: 'U position', value: '', path: 'Uposition', locked: true },
   { id: 3, name: 'Model', value: '', path: 'Model' },
   { id: 4, name: 'Serial number', value: '', path: 'SerialNumber' },
   { id: 5, name: 'CPU cores', value: '', path: 'ProcessorSummary.CoreCount' },
   { id: 6, name: 'Memory GiB', value: '', path: 'MemorySummary.TotalSystemMemoryGiB' },
   { id: 7, name: 'NIC count', value: '', path: 'NetworkInterfaces.Members.length' }
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
         matches.push({ path, value });
      }

      matches.push(...findMatchingPaths(value, searchTerm, path));
   });

   return matches;
}

function isSearchableValue(value) {
   return !Array.isArray(value) && (value === null || typeof value !== 'object');
}

function getAssetJsonText(asset) {
   if (!asset?.rawJson) return prettyPrint({});

   try {
      const parsed = JSON.parse(asset.rawJson);
      return typeof parsed === 'string' ? parsed : prettyPrint(parsed);
   } catch {
      return asset.rawJson;
   }
}

function buildFieldsFromAsset(asset) {
   return [
      {
         id: 'asset-name',
         name: 'Asset name',
         value: asset?.name ?? '',
         path: 'name',
         locked: true
      },
      { id: 'asset-uuid', name: 'UUID', value: asset?.uuid ?? '', path: 'uuid', locked: true },

      {
         id: 'asset-u-position',
         name: 'U position',
         value: asset?.uPosition ?? '',
         path: 'uPosition',
         locked: true
      },
      ...(asset?.dataFields ?? [])
         .filter((field) => field.title !== 'File name')
         .map((field, index) => ({
            id: field._id ?? `${field.title}-${field.path}-${index}`,
            name: field.title ?? field.name ?? '',
            value: field.value ?? '',
            path: field.path ?? ''
         }))
   ];
}

export default function EditAsset() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const assetId = searchParams.get('id');

   const [asset, setAsset] = useState(null);
   const [racks, setRacks] = useState([]);
   const [manufacturers, setManufactures] = useState([]);
   const [selectedRack, setSelectedRack] = useState('');
   const [selectedManufacturer, setSelectedManufacturer] = useState('');
   const [notes, setNotes] = useState('');
   const [jsonText, setJsonText] = useState(prettyPrint({}));
   const [fileName, setFileName] = useState(null);
   const [fields, setFields] = useState([]);
   const [fieldLabel, setFieldLabel] = useState('');
   const [fieldPath, setFieldPath] = useState('');
   const [pathSearch, setPathSearch] = useState('');
   const [editingFieldId, setEditingFieldId] = useState(null);
   const editInputRef = useRef(null);

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

   const selectedRackName =
      racks.find((rack) => rack._id === selectedRack)?.name ?? asset?.rack?.name ?? 'Select a rack';
   const selectedManufacturerName =
      manufacturers.find(
         (manufacturer) => String(manufacturer.value) === String(selectedManufacturer)
      )?.name ??
      asset?.manufacturer ??
      'Select a manufacturer';
   const savedFileName = asset?.dataFields?.find((field) => field.title === 'File name')?.value;
   const displayedFileName = fileName ?? savedFileName;
   const pathMatches = parsedJson
      ? findMatchingPaths(parsedJson, pathSearch)
           .filter((match) => isSearchableValue(match.value))
           .sort((a, b) => {
              const da = a.path.split('.').length;
              const db = b.path.split('.').length;
              if (da !== db) return da - db;
              return a.path.localeCompare(b.path);
           })
           .slice(0, 12)
      : [];

   useEffect(() => {
      async function getRacks() {
         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/racks`);
         const data = await res.json();
         setRacks(data.body);
      }

      getRacks();
   }, []);

   useEffect(() => {
      async function getManufactures() {
         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enums/Manufacturers`);
         const data = await res.json();
         setManufactures(data.body);
      }

      getManufactures();
   }, []);

   useEffect(() => {
      async function getAsset() {
         if (!assetId) return;

         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets/${assetId}`);
         const data = await res.json();

         if (!res.ok) {
            alert(data.message ?? 'Failed to load asset');
            return;
         }

         setAsset(data.body);
         setSelectedRack(data.body?.rack?._id ?? data.body?.rack ?? '');
         setSelectedManufacturer(data.body?.manufacturer ?? '');
         setNotes(data.body?.notes ?? '');
         setJsonText(getAssetJsonText(data.body));
         setFields(buildFieldsFromAsset(data.body));
      }

      getAsset();
   }, [assetId]);

   useEffect(() => {
      if (editingFieldId !== null) {
         editInputRef.current?.focus();
      }
   }, [editingFieldId]);

   async function handleFileChange(event) {
      const file = event.target.files?.[0];
      if (!file) return;

      setFields(newImportFields);
      setFieldLabel('');
      setFieldPath('');
      setPathSearch('');
      setEditingFieldId(null);
      setNotes('');
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

   async function handleSubmit() {
      if (!confirm('Are you sure you want to save these changes?')) {
         return;
      }

      const assetNameField = fields.find((field) => field.name === 'Asset name');
      const uPosField = fields.find((field) => field.name === 'U position');
      const assetName = assetNameField ? getFieldValue(assetNameField) : '';
      const uPos = uPosField ? getFieldValue(uPosField) : '';
      const collectedFields = fields
         .filter(
            (field) =>
               field.name !== 'Asset name' && field.name !== 'UUID' && field.name !== 'U position'
         )
         .map((field) => ({
            title: field.name,
            value: getFieldValue(field),
            path: field.path
         }));

      if (fileName || savedFileName) {
         collectedFields.push({
            title: 'File name',
            value: fileName ?? savedFileName,
            path: 'fileName'
         });
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets/${assetId}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            name: assetName,
            rack: selectedRack,
            uPosition: Number(uPos),
            manufacturer: selectedManufacturer,
            manufacture: selectedManufacturer,
            notes,
            dataFields: collectedFields,
            rawJson: parsedJson ? prettyPrint(parsedJson) : jsonText
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
            <Loading />
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
      <section>
         <div className="flex items-center">
            <h1 className="font-semibold text-center text-4xl md:text-left">
               Edit <em>{asset?.name ?? assetId}</em>
            </h1>
            <Link
               href={`/assets?id=${asset.uuid}`}
               className="ml-4 h-min w-min rounded-full border border-slate-400 bg-slate-800 p-2 transition hover:-translate-y-1 hover:bg-slate-900"
            >
               Cancel
            </Link>
         </div>

         <div className="mt-15 flex flex-wrap items-center gap-2">
            <Listbox value={selectedRack} onChange={setSelectedRack}>
               <div className="relative m-1 w-fit">
                  <ListboxButton className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-full border border-slate-400 bg-slate-900 px-3 text-left text-white focus:outline-none">
                     <span className="truncate">{selectedRackName}</span>
                     <FaChevronDown />
                  </ListboxButton>
                  <ListboxOptions className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-slate-400 bg-slate-900 p-1 text-white shadow-2xl focus:outline-none">
                     <ListboxOption
                        value=""
                        className="cursor-pointer rounded-md p-2 text-sm text-slate-400 hover:bg-slate-800"
                     >
                        Select a rack
                     </ListboxOption>

                     {racks.map((rack) => (
                        <ListboxOption
                           key={rack._id}
                           value={rack._id}
                           className="cursor-pointer rounded-md p-2 text-sm hover:bg-slate-800"
                        >
                           {rack.name}
                        </ListboxOption>
                     ))}
                  </ListboxOptions>
               </div>
            </Listbox>

            <Listbox value={selectedManufacturer} onChange={setSelectedManufacturer}>
               <div className="relative m-1 w-fit">
                  <ListboxButton className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-full border border-slate-400 bg-slate-900 px-3 text-left text-white focus:outline-none">
                     <span className="truncate">{selectedManufacturerName}</span>
                     <FaChevronDown />
                  </ListboxButton>
                  <ListboxOptions className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-slate-400 bg-slate-900 p-1 text-white shadow-2xl focus:outline-none">
                     <ListboxOption
                        value=""
                        className="cursor-pointer rounded-md p-2 text-sm text-slate-400 hover:bg-slate-800"
                     >
                        Select a manufacturer
                     </ListboxOption>

                     {manufacturers.map((manufacturer) => (
                        <ListboxOption
                           key={manufacturer.value}
                           value={manufacturer.value}
                           className="cursor-pointer rounded-md p-2 text-sm hover:bg-slate-800"
                        >
                           {manufacturer.name}
                        </ListboxOption>
                     ))}
                  </ListboxOptions>
               </div>
            </Listbox>

            <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-800 bg-white px-4 text-md font-semibold text-slate-900 transition duration-200 ease-in-out hover:border-blue hover:bg-blue-800 hover:text-white">
               Upload file <LuUpload />
               <input
                  type="file"
                  accept="application/json,.json,.txt"
                  onChange={handleFileChange}
                  className="sr-only"
               />
            </label>
            {displayedFileName && (
               <span className="text-md flex items-center gap-1 text-slate-300">
                  {displayedFileName}
                  <FaFileAlt />
               </span>
            )}
         </div>

         <div className="mt-4">
            <div className="rounded-lg border border-slate-400 bg-slate-900 shadow-2xl drop-shadow-2xl">
               <h2 className="rounded-t-lg bg-slate-800 p-4 text-2xl text-slate-300">
                  Tracked fields
               </h2>

               <div className="border-b border-slate-700 p-4">
                  <label className="block">
                     <span className="block p-1 text-slate-300">Search keys</span>
                     <input
                        value={pathSearch}
                        onChange={(event) => setPathSearch(event.target.value)}
                        placeholder="SerialNumber"
                        className="m-1 h-9 w-full rounded-lg border border-slate-400 p-1 text-white placeholder:text-slate-500 md:w-1/2"
                     />
                  </label>

                  {parseError && <p className="mt-2 text-sm text-red-300">{parseError}</p>}

                  {pathSearch && (
                     <div className="mt-3 max-h-56 max-w-fit overflow-auto rounded-lg border border-slate-700 bg-slate-950">
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
                                 className="block w-full cursor-pointer border-b border-slate-800 p-2 text-left text-sm transition hover:bg-slate-900"
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
                        className="m-1 h-9 w-full rounded-lg border border-slate-400 p-1 text-white md:w-1/2"
                     />
                  </label>

                  <label className="mt-2 block">
                     <span className="block p-1 text-slate-300">JSON path</span>
                     <input
                        value={fieldPath}
                        onChange={(event) => setFieldPath(event.target.value)}
                        placeholder="ProcessorSummary.CoreCount"
                        className="m-1 h-9 w-full rounded-lg border border-slate-400 p-1 text-white placeholder:text-slate-500 sm:w-1/2"
                     />
                  </label>

                  <button
                     type="submit"
                     className="mt-4 cursor-pointer rounded-full border border-blue-700 bg-blue-700 px-3 py-2 text-sm transition hover:-translate-y-1 hover:border-blue-900 hover:bg-blue-900"
                  >
                     Add Field
                  </button>
               </form>

               <div className="grid grid-cols-1 divide-y sm:grid-cols-2 lg:grid-cols-3">
                  {fields.map((field) => (
                     <div key={field.id} className="border border-slate-800 p-4">
                        <div className="flex items-start justify-between gap-3">
                           <div>
                              <p className="font-medium text-slate-300">{field.name}</p>
                           </div>
                           <div className="flex gap-2">
                              <button
                                 type="button"
                                 onClick={() => handleEditField(field)}
                                 className="rounded-full border border-slate-400 px-2 py-1 text-xs text-slate-300 transition hover:-translate-y-1 hover:bg-slate-800"
                              >
                                 {editingFieldId === field.id ? 'Save' : 'Edit'}
                              </button>

                              {!field.locked && (
                                 <button
                                    type="button"
                                    onClick={() => handleRemoveField(field.id)}
                                    className="rounded-full border border-slate-400 px-2 py-1 text-xs text-slate-300 transition hover:-translate-y-1 hover:bg-red-900"
                                 >
                                    Remove
                                 </button>
                              )}
                           </div>
                        </div>
                        {editingFieldId === field.id ? (
                           <input
                              ref={editInputRef}
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

         <div className="mt-4 rounded-lg border border-slate-400 bg-slate-900 p-4 shadow-2xl drop-shadow-2xl">
            <label className="block">
               <span className="block p-1 text-slate-300">Notes</span>
               <textarea
                  name="notes"
                  rows={5}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="m-1 w-full rounded-lg border border-slate-400 p-1 text-white"
               />
            </label>
         </div>

         <div className="mt-4 flex justify-end">
            <button
               type="button"
               onClick={handleSubmit}
               className="inline-flex h-10 w-fit-content cursor-pointer items-center justify-center gap-2 rounded-full border border-green-800 bg-white px-4 font-medium text-slate-900 transition duration-200 ease-in-out hover:bg-green-800 hover:text-white"
            >
               Save changes <IoSend />
            </button>
         </div>
      </section>
   );
}
