import { ensureSeeded, getAllCars, getAllLeads } from '@/lib/db';
import Link from 'next/link';

type Lead = { id: string; name: string; phone: string; email: string; car_name: string; source: string; status: string; created_at: string };

export default function AdminDashboard() {
  ensureSeeded();

  const allCars = getAllCars();
  const allLeads = getAllLeads() as unknown as Lead[];

  const activeCars = allCars.filter(c => c.status === 'active').length;
  const soldCars = allCars.filter(c => c.status === 'sold').length;
  const newLeads = allLeads.filter(l => l.status === 'NEW').length;
  const totalViews = allCars.reduce((sum, c) => sum + c.views, 0);
  const recentLeads = allLeads.slice(0, 5);

  const stats = [
    { label: 'Masini active', value: activeCars, color: 'bg-blue-50 text-blue-700' },
    { label: 'Masini vandute', value: soldCars, color: 'bg-green-50 text-green-700' },
    { label: 'Lead-uri noi', value: newLeads, color: 'bg-red-50 text-red-700' },
    { label: 'Vizualizari', value: totalViews, color: 'bg-purple-50 text-purple-700' },
  ];

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-800',
    CONTACTED: 'bg-yellow-100 text-yellow-800',
    QUALIFIED: 'bg-green-100 text-green-800',
    NEGOTIATION: 'bg-purple-100 text-purple-800',
    WON: 'bg-green-100 text-green-800',
    LOST: 'bg-gray-100 text-gray-800',
  };

  // Demo chart data
  const chartDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('ro-RO', { weekday: 'short' });
  });
  const chartValues = [2, 1, 3, 0, 2, 4, 1];
  const maxVal = Math.max(...chartValues, 1);

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Bun venit, AutoVizibil</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className={`rounded-xl p-5 ${s.color}`}>
            <p className="text-sm font-medium opacity-70">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-border p-6 mb-8">
        <h2 className="font-semibold text-primary mb-4">Lead-uri in ultimele 7 zile</h2>
        <div className="flex items-end gap-3 h-40">
          {chartValues.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-text-lighter">{v}</span>
              <div className="w-full bg-accent/80 rounded-t" style={{ height: `${(v / maxVal) * 100}%`, minHeight: v > 0 ? '8px' : '2px' }} />
              <span className="text-xs text-text-lighter">{chartDays[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent leads */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold text-primary">Ultimele lead-uri</h2>
          <Link href="/admin/leads" className="text-sm text-accent hover:underline">Vezi toate</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="text-left py-3 px-5 font-medium text-text-lighter">Nume</th>
                <th className="text-left py-3 px-5 font-medium text-text-lighter">Telefon</th>
                <th className="text-left py-3 px-5 font-medium text-text-lighter hidden md:table-cell">Masina</th>
                <th className="text-left py-3 px-5 font-medium text-text-lighter hidden lg:table-cell">Sursa</th>
                <th className="text-left py-3 px-5 font-medium text-text-lighter">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map(lead => (
                <tr key={lead.id} className="border-t border-border hover:bg-surface/50">
                  <td className="py-3 px-5 font-medium text-primary">{lead.name}</td>
                  <td className="py-3 px-5 text-text-light">{lead.phone}</td>
                  <td className="py-3 px-5 text-text-light hidden md:table-cell">{lead.car_name || '-'}</td>
                  <td className="py-3 px-5 text-text-light hidden lg:table-cell">{lead.source}</td>
                  <td className="py-3 px-5"><span className={`badge ${statusColors[lead.status] || 'bg-gray-100 text-gray-800'}`}>{lead.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
