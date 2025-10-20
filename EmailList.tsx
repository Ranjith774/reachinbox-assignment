import React, { useEffect, useState } from 'react';

export default function EmailList({ filters, onSelect }: any) {
  const [emails, setEmails] = useState<any[]>([]);

  useEffect(() => {
    const q = new URLSearchParams();
    if (filters.q) q.set('q', filters.q);
    if (filters.account) q.set('account', filters.account);
    if (filters.folder) q.set('folder', filters.folder);
    fetch(/api/emails?${q.toString()}).then(r=>r.json()).then(setEmails).catch(console.error);
  }, [filters]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Emails</h2>
      <div className="space-y-2">
        {emails.map(e => (
          <div key={e.id} onClick={()=>onSelect(e)} className="p-2 border rounded hover:bg-sky-50 cursor-pointer">
            <div className="text-sm font-medium">{e.subject}</div>
            <div className="text-xs text-slate-500">{e.from} • {new Date(e.date).toLocaleString()}</div>
            <div className="text-xs text-slate-700 mt-1">Label: {e.labels?.[0] || '—'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}