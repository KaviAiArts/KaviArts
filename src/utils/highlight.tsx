import React from "react";

export default function highlight(text: string, query: string): React.ReactNode {
  if (!text) return text;
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <b key={i} className="font-bold text-foreground">
            {part}
          </b>
        ) : (
          part
        )
      )}
    </>
  );
}
