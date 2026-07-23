'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';
import { updateAppointmentStatus, deleteAppointment } from '@/app/actions/admin';

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AppointmentStatusControl({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [busy, setBusy] = useState(false);

  const handleChange = async (newStatus: string) => {
    setBusy(true);
    try {
      await updateAppointmentStatus(id, newStatus);
      setCurrent(newStatus);
      router.refresh();
    } catch (err: any) {
      alert(err?.message || 'Failed to update status');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this appointment request?')) return;
    setBusy(true);
    try {
      await deleteAppointment(id);
      router.refresh();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <select
        value={current}
        disabled={busy}
        onChange={(e) => handleChange(e.target.value)}
        className={`text-xs font-bold px-2.5 py-1.5 rounded-full border-0 outline-none cursor-pointer disabled:opacity-50 ${statusStyles[current] || 'bg-slate-100 text-slate-600'}`}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <button
        onClick={handleDelete}
        disabled={busy}
        className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50"
        title="Delete"
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
}
