// src/components/Autocomplete.tsx
import React from "react";

interface Suggestion {
  id: number;
  file_name: string;
  category?: string;
  tags?: string[];
  highlightName?: React.ReactNode;
  highlightCategory?: React.ReactNode;
  highlightTags?: React.ReactNode;
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

  const trimmed = suggestions.slice(0, 5);

  return (
    <div
      className="
        absolute 
        w-full                 /* ⭐ Fit exactly the width of search bar */
        bg-card 
        border border-border 
        rounded-xl 
        shadow-xl 
        z-50 
        max-h-64 
        overflow-y-auto 
        no-scrollbar
      "
      style={{
        top: "52px",          /* ⭐ Slightly lower for desktop spacing */
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
              transition-colors
              ${isActive ? "bg-secondary" : "hover:bg-secondary/60"}
            `}
          >
            <div className="font-semibold text-sm truncate">
              {item.highlightName || item.file_name}
            </div>

            {item.category && (
              <div className="text-xs text-muted-foreground truncate">
                {item.highlightCategory || item.category}
              </div>
            )}

            {item.tags && item.tags.length > 0 && (
              <div className="text-xs text-muted-foreground truncate">
                [{item.highlightTags || item.tags.join(", ")}]
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Autocomplete;
