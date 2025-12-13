import { Button } from "@/components/ui/button";
import { Video, Image, Sparkles, Music } from "lucide-react";

const categories = [
  { label: "Aesthetic", value: "aesthetic", icon: Sparkles },
  { label: "Nature", value: "nature", icon: Flower2 },
  { label: "Animals", value: "animal", icon: PawPrint },
  { label: "Characters", value: "character", icon: UserRound },
  { label: "Fantasy", value: "fantasy", icon: Wand2 },
  { label: "Technology", value: "technology", icon: Bot },
];

const CategoryNav = ({ onSelect }) => {
  return (
    <section className="py-8 px-4 border-b border-border">
      <div className="container mx-auto">


        <div className="flex flex-wrap gap-3 justify-center items-center max-w-5xl mx-auto">



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
