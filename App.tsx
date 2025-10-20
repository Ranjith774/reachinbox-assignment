import React, { useEffect, useState } from 'react';
import EmailList from './components/EmailList';
import EmailViewer from './components/EmailViewer';
import Filters from './components/Filters';

export default function App() {
  const [selected, setSelected] = useState<any>(null);
  const [filters, setFilters] = useState({ q: '', account: '', folder: '' });

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-sky-700 mb-4">ReachInbox — Onebox</h1>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <Filters onChange={setFilters} />
          </div>
          <div className="col-span-2">
            <EmailList filters={filters} onSelect={setSelected} />
          </div>
          <div className="col-span-1">
            <EmailViewer email={selected} />
          </div>
        </div>
      </div>
    </div>
  );
}