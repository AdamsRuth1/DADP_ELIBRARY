import React, { useMemo, useState } from "react";

function hashColor(input) {
  let h = 0;
  const s = String(input || "");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return `hsl(${hue} 45% 35%)`;
}

export default function BookCover({ src, title, category, className = "" }) {
  const [ok, setOk] = useState(true);
  const initials = useMemo(() => {
    const t = String(title || "").trim();
    if (!t) return "BK";
    const parts = t.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("") || "BK";
  }, [title]);

  const bg1 = useMemo(() => hashColor(category || title || "book"), [category, title]);
  const bg2 = useMemo(() => hashColor(`${category || title || "book"}-2`), [category, title]);

  return (
    <div
      className={[
        "relative w-full h-full overflow-hidden",
        className
      ].join(" ")}
      style={{
        backgroundImage: `linear-gradient(135deg, ${bg1}, ${bg2})`
      }}
    >
      {src && ok ? (
        <img
          src={src}
          alt={title || "Book cover"}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setOk(false)}
          loading="lazy"
        />
      ) : null}

      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute left-4 top-4">
        <div className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/10 px-3 py-2 backdrop-blur-sm">
          <div className="text-white font-bold tracking-wide">{initials}</div>
        </div>
      </div>
    </div>
  );
}

