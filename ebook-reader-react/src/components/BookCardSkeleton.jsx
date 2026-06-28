export default function BookCardSkeleton() {
  return (
    <div className="w-44 animate-pulse">
      <div className="aspect-[2/3] rounded-xl bg-muted" />

      <div className="mt-3 h-4 rounded bg-muted" />

      <div className="mt-2 h-4 w-2/3 rounded bg-muted" />

      <div className="mt-4 h-8 rounded bg-muted" />
    </div>
  );
}