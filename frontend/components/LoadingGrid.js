export default function LoadingGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, idx) => (
        <div key={idx} className="animate-pulse rounded-2xl border border-slate-100 bg-white p-4">
          <div className="h-56 rounded-xl bg-slate-200" />
          <div className="mt-4 h-4 w-1/2 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
          <div className="mt-4 h-9 w-full rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
