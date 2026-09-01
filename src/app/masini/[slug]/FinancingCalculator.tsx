'use client';
import { useState } from 'react';

export default function FinancingCalculator({ price, currency }: { price: number; currency: string }) {
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.2));
  const [months, setMonths] = useState(60);
  const rate = 0.08;
  const loanAmount = price - downPayment;
  const monthlyRate = rate / 12;
  const payment = loanAmount > 0 ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1) : 0;
  const symbol = currency === 'EUR' ? '\u20AC' : 'RON';

  return (
    <div className="bg-surface rounded-xl p-6">
      <h2 className="text-xl font-bold text-primary mb-1">Calculator rata estimativa</h2>
      <p className="text-xs text-text-lighter mb-4">Simulare orientativa. Nu reprezinta o oferta financiara reala.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-light mb-1">Pret ({symbol})</label>
          <input type="number" value={price} disabled className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white opacity-60" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-light mb-1">Avans ({symbol})</label>
          <input type="number" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-light mb-1">Perioada (luni)</label>
          <select value={months} onChange={e => setMonths(Number(e.target.value))} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white">
            <option value={24}>24 luni</option>
            <option value={36}>36 luni</option>
            <option value={48}>48 luni</option>
            <option value={60}>60 luni</option>
            <option value={72}>72 luni</option>
            <option value={84}>84 luni</option>
          </select>
        </div>
      </div>
      {payment > 0 && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-border">
          <p className="text-sm text-text-light">Rata lunara estimativa</p>
          <p className="text-2xl font-bold text-primary">{symbol}{Math.round(payment).toLocaleString('ro-RO')} / luna</p>
        </div>
      )}
    </div>
  );
}
