'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit2, Trash2, Loader2 } from 'lucide-react';

interface RowActionsProps {
  editHref?: string;
  onDelete: () => Promise<{ success: boolean }>;
  confirmMessage?: string;
}

export default function RowActions({ editHref, onDelete, confirmMessage = 'Delete this item? This cannot be undone.' }: RowActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(confirmMessage)) return;
    setDeleting(true);
    try {
      await onDelete();
      router.refresh();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {editHref && (
        <Link
          href={editHref}
          className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
          title="Edit"
        >
          <Edit2 size={16} />
        </Link>
      )}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50"
        title="Delete"
      >
        {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
}
