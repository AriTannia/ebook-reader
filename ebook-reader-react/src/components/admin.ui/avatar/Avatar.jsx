import { useState } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AVATAR_TINTS = [
  "bg-[oklch(0.93_0.05_286)] text-[oklch(0.45_0.18_286)]",
  "bg-[oklch(0.93_0.06_180)] text-[oklch(0.42_0.1_190)]",
  "bg-[oklch(0.94_0.06_70)] text-[oklch(0.48_0.12_60)]",
  "bg-[oklch(0.94_0.05_20)] text-[oklch(0.5_0.15_22)]",
  "bg-[oklch(0.93_0.05_150)] text-[oklch(0.44_0.11_150)]",
];

function initials(name) {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function tintFor(name) {
  const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_TINTS[sum % AVATAR_TINTS.length];
}

// Avatar component -------------------------------------------------------

export function Avatar({ src, name, className }) {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;

  return (
    <span
      className={cx(
        "inline-flex size-8 shrink-0 items-center justify-center",
        "overflow-hidden rounded-full text-xs font-semibold",
        !showImage ? tintFor(name) : "",
        className || "",
      )}
      aria-hidden="true"
    >
      {showImage ? (
        <img
          src={src || "/placeholder.svg"}
          alt=""
          className="size-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}