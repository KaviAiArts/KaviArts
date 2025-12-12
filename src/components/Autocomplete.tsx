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

  return (
    <div
      className="
        absolute left-0 right-0 mt-1 
        bg-card border border-border rounded-lg shadow-lg 
        z-50 max-h-80 overflow-y-auto
      "
    >
      {suggestions.map((item, index) => {
        const isActive = activeIndex === index;

        return (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className={`
              px-4 py-3 cursor-pointer 
              hover:bg-secondary transition-colors
              ${isActive ? "bg-secondary" : ""}
            `}
          >
            {/* Title */}
            <div className="font-semibold text-sm">
              {item.highlightName || item.file_name}
            </div>

            {/* Category */}
            {item.category && (
              <div className="text-xs text-muted-foreground mt-0.5">
                {item.highlightCategory || item.category}
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                [
                {item.highlightTags ||
                  item.tags.join(", ")}
                ]
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Autocomplete;
