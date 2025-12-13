import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Flower2,
  PawPrint,
  UserRound,
  Wand2,
  Bot,
} from "lucide-react";

const categories = [
  { label: "Aesthetic", value: "aesthetic", icon: Sparkles },
  { label: "Nature", value: "nature", icon: Flower2 },
  { label: "Animals", value: "animal", icon: PawPrint },
  { label: "Characters", value: "character", icon: UserRound },
  { label: "Fantasy", value: "fantasy", icon: Wand2 },
  { label: "Technology", value: "technology", icon: Bot },
];

type Props = {
  onSelect?: (value: string) => void;
};

const CategoryNav = ({ onSelect = () => {} }: Props) => {
  return (



    <section className="pt-0 pb-8 md:pb-12 px-4 border-b border-border">




      <div className="container mx-auto">
        <div
          className="
            grid grid-cols-3 gap-3
            md:flex md:flex-wrap md:justify-center md:items-center
            max-w-5xl mx-auto
          "
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.value}
                onClick={() => onSelect(cat.value)}
                variant="outline"
                className="h-11 flex items-center justify-center gap-2 hover-lift"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs sm:text-sm truncate">
                  {cat.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;
