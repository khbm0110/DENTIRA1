'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setFaqActive } from '@/app/actions/admin';

export default function FaqActiveToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [active, setActive] = useState(isActive);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    try {
      await setFaqActive(id, !active);
      setActive(!active);
      router.refresh();
    } catch (err: any) {
      alert(err?.message || 'Failed to update');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors disabled:opacity-50 ${
        active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {active ? 'Active' : 'Hidden'}
    </button>
  );
}
