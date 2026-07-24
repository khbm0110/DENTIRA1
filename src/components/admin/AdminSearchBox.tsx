import { Search } from 'lucide-react';

export default function AdminSearchBox({ basePath, defaultValue, placeholder }: { basePath: string; defaultValue?: string; placeholder: string }) {
  return (
    <form action={basePath} method="GET" className="relative w-full sm:w-80">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <input
        type="text"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
      />
    </form>
  );
}
