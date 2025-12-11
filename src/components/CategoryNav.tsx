import { Button } from "@/components/ui/button";
import { Video, Image, Sparkles, Music } from "lucide-react";

const categories = [
  { label: "All", value: "all", icon: Sparkles, active: true },
  { label: "Wallpapers", value: "wallpaper", icon: Image },
  { label: "Ringtones", value: "ringtone", icon: Music },
  { label: "Videos", value: "video", icon: Video },
];

const CategoryNav = ({ onSelect }) => {
  return (
    <section className="py-8 px-4 border-b border-border">
      <div className="container mx-auto">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.value}
                onClick={() => onSelect(cat.value)}
                variant={cat.active ? "default" : "outline"}
                className={`
                  flex items-center space-x-2 hover-lift
                  ${cat.active 
                    ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                    : 'border-border hover:bg-secondary'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;
