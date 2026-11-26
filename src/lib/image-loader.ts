"use client";

type LoaderArgs = { src: string; width: number; quality?: number };

export default function imageLoader({ src, width, quality }: LoaderArgs) {
  if (!src.startsWith("https://images.unsplash.com/")) return src;
  const params = new URLSearchParams({
    auto: "format",
    fit: "crop",
    w: String(width),
    q: String(quality ?? 70),
  });
  return `${src}?${params.toString()}`;
}
