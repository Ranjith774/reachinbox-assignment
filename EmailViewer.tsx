import React from 'react';

export default function EmailViewer({ email }: any) {
  if (!email) return <div className="bg-white p-4 rounded shadow">Select an email</div>;
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold">{email.subject}</h3>
      <div className="text-xs text-slate-500">From: {email.from}</div>
      <div className="mt-3 text-sm whitespace-pre-wrap">{email.body}</div>
      <div className="mt-3 text-sm font-medium">Label: {email.labels?.[0] || '—'}</div>
    </div>
  );
}