export default function SiteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
        <span className="text-sm font-medium text-on-surface-variant">Dentora</span>
      </div>
    </div>
  );
}
