export function BookCover({ src, title }) {
  return (
    <span className="inline-flex h-12 w-9 shrink-0 overflow-hidden rounded-sm border border-border bg-muted shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || "/placeholder.svg"}
        alt={`Cover of ${title}`}
        className="size-full object-cover"
      />
    </span>
  );
}