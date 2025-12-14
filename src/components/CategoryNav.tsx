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
    <section className="pt-4 pb-4 px-4 border-b border-border">
      <div className="container mx-auto">
        <div className="w-full flex justify-center">
          {/* MOBILE: 2 rows × 3 cols | DESKTOP: original flex */}
          <div
            className="
              grid grid-cols-3 gap-3
              md:flex md:flex-wrap md:gap-3 md:justify-center
              max-w-5xl w-full
            "
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.value}
                  variant="outline"
                  onClick={() => onSelect(cat.value)}
                  className="
                    h-10
                    flex items-center justify-center gap-2
                    text-xs px-2
                    hover-lift
                    w-full
                  "
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{cat.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;
