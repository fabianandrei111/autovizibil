'use client';
import { useEffect, useState } from 'react';

type Lead = { id: string; name: string; phone: string; email: string; message: string; car_name: string; source: string; status: string; type: string; created_at: string };

const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'NEGOTIATION', 'WON', 'LOST'];
const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  QUALIFIED: 'bg-green-100 text-green-800',
  NEGOTIATION: 'bg-purple-100 text-purple-800',
  WON: 'bg-emerald-100 text-emerald-800',
  LOST: 'bg-gray-100 text-gray-800',
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLeads(); }, []);

  async function fetchLeads() {
    const res = await fetch('/api/leads');
    setLeads(await res.json());
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/leads', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    fetchLeads();
  }

  if (loading) return <div className="text-text-light">Se incarca...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Lead-uri ({leads.length})</h1>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-text-lighter">Nume</th>
                <th className="text-left py-3 px-4 font-medium text-text-lighter">Telefon</th>
                <th className="text-left py-3 px-4 font-medium text-text-lighter hidden md:table-cell">Email</th>
                <th className="text-left py-3 px-4 font-medium text-text-lighter hidden lg:table-cell">Masina</th>
                <th className="text-left py-3 px-4 font-medium text-text-lighter hidden lg:table-cell">Sursa</th>
                <th className="text-left py-3 px-4 font-medium text-text-lighter">Status</th>
                <th className="text-left py-3 px-4 font-medium text-text-lighter hidden md:table-cell">Data</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="border-t border-border hover:bg-surface/50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-primary">{lead.name}</p>
                    {lead.message && <p className="text-xs text-text-lighter mt-0.5 truncate max-w-[200px]">{lead.message}</p>}
                  </td>
                  <td className="py-3 px-4"><a href={`tel:${lead.phone}`} className="text-text-light hover:text-accent">{lead.phone}</a></td>
                  <td className="py-3 px-4 text-text-light hidden md:table-cell">{lead.email || '-'}</td>
                  <td className="py-3 px-4 text-text-light hidden lg:table-cell text-xs">{lead.car_name || '-'}</td>
                  <td className="py-3 px-4 text-text-light hidden lg:table-cell">{lead.source}</td>
                  <td className="py-3 px-4">
                    <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)} className={`badge cursor-pointer ${statusColors[lead.status] || 'bg-gray-100'}`}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-text-lighter text-xs hidden md:table-cell">{new Date(lead.created_at).toLocaleDateString('ro-RO')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
