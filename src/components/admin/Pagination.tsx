import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  basePath,
  currentPage,
  totalPages,
  searchQuery,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
}) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (searchQuery) params.set('q', searchQuery);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
      <span className="text-xs text-slate-400">Page {currentPage} of {totalPages}</span>
      <div className="flex items-center gap-2">
        <Link
          href={buildHref(Math.max(1, currentPage - 1))}
          aria-disabled={currentPage <= 1}
          className={`p-2 rounded-lg border border-slate-200 ${currentPage <= 1 ? 'text-slate-300 pointer-events-none' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <ChevronLeft size={16} />
        </Link>
        <Link
          href={buildHref(Math.min(totalPages, currentPage + 1))}
          aria-disabled={currentPage >= totalPages}
          className={`p-2 rounded-lg border border-slate-200 ${currentPage >= totalPages ? 'text-slate-300 pointer-events-none' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
