export default function SectionSkeleton({ height = 'py-24' }: { height?: string }) {
  return (
    <div className={`${height} bg-surface`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-64 bg-slate-200 rounded-full mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-56 bg-slate-100 rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
