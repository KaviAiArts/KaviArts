// src/components/Autocomplete.tsx
import React from "react";

interface Suggestion {
  id: number;
  file_name: string;
  file_type?: "wallpaper" | "ringtone" | "video";
  highlightName?: React.ReactNode;
}

interface Props {
  suggestions: Suggestion[];
  visible: boolean;
  activeIndex: number;
  onSelect: (item: Suggestion) => void;
}

const Autocomplete: React.FC<Props> = ({
  suggestions,
  visible,
  activeIndex,
  onSelect,
}) => {
  if (!visible || suggestions.length === 0) return null;

  const trimmed = suggestions.slice(0, 5); // top 5 only

  return (
    <div
      className="
        absolute 
        w-full
        bg-card 
        border border-border 
        rounded-lg 
        shadow-xl 
        z-50 
        overflow-hidden 
      "
      style={{
        top: "48px", // Desktop alignment
      }}
    >
      {trimmed.map((item, index) => {
        const isActive = activeIndex === index;

        return (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className={`
              px-4 py-3 cursor-pointer truncate 
              text-left
              ${isActive ? "bg-secondary" : "hover:bg-secondary/60"}
            `}
          >
            {/* Title */}
            <div className="font-semibold text-sm truncate">
              {item.highlightName || item.file_name}
            </div>

            {/* File type only (wallpaper / ringtone / video) */}
            {item.file_type && (
              <div className="text-xs text-muted-foreground truncate">
                {item.file_type}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Autocomplete;
