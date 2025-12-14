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
        {/* MOBILE: grid | DESKTOP: original flex */}
        <div
          className="
            grid grid-cols-3 gap-3
            md:flex md:flex-wrap md:justify-center md:gap-3
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
  h-9
  w-full
  flex items-center justify-center gap-1.5

  px-2
  text-[11px] font-medium
  whitespace-nowrap

  rounded-lg
  border border-border
  bg-card text-foreground

  hover:bg-primary/15
  hover:border-primary
  hover:text-primary
  transition-colors

  md:h-10 md:w-auto md:px-4 md:text-sm md:rounded-lg
"






              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{cat.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;
