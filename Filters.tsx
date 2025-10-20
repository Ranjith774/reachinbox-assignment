import React from 'react';

export default function Filters({ onChange }: any) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="mb-2">
        <label className="text-sm">Search</label>
        <input onChange={e=>onChange((prev:any)=>({...prev, q: e.target.value}))} className="w-full mt-1 p-2 border rounded" />
      </div>
      <div className="mb-2">
        <label className="text-sm">Account</label>
        <select onChange={e=>onChange((prev:any)=>({...prev, account: e.target.value}))} className="w-full mt-1 p-2 border rounded">
          <option value="">All</option>
          <option value="acc1">acc1</option>
        </select>
      </div>
      <div>
        <label className="text-sm">Folder</label>
        <select onChange={e=>onChange((prev:any)=>({...prev, folder: e.target.value}))} className="w-full mt-1 p-2 border rounded">
          <option value="">All</option>
          <option value="INBOX">INBOX</option>
        </select>
      </div>
    </div>
  );
}