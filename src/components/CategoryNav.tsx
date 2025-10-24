import { Button } from "@/components/ui/button";
import { Video, Image, Palette, Sparkles, Zap, Music, Heart } from "lucide-react";

const categories = [
  { name: "All", icon: Sparkles, active: true },
  { name: "Abstract", icon: Palette },
  { name: "Nature", icon: Image },
  { name: "Technology", icon: Zap },
  { name: "Animals", icon: Heart },
  { name: "Ringtones", icon: Music },
  { name: "Videos", icon: Video },
];

const CategoryNav = () => {
  return (
    <section className="py-8 px-4 border-b border-border">
      <div className="container mx-auto">
        
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.name}
                variant={category.active ? "default" : "outline"}
                className={`
                  flex items-center space-x-2 hover-lift
                  ${category.active 
                    ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                    : 'border-border hover:bg-secondary'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;