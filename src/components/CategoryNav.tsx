import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Flower2,
  PawPrint,
  UserRound,
  Wand2,
  Paintbrush,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  { label: "Typography", value: "typography", icon: Sparkles, glow: "btn-typography" },
  { label: "Nature", value: "nature", icon: Flower2, glow: "btn-nature" },
  { label: "Animals", value: "animal", icon: PawPrint, glow: "btn-animals" },
  { label: "Characters", value: "character", icon: UserRound, glow: "btn-characters" },
  { label: "Fantasy", value: "fantasy", icon: Wand2, glow: "btn-fantasy" },
  { label: "Artistic", value: "artistic", icon: Paintbrush, glow: "btn-artistic" },
];

const CategoryNav = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-4 pb-4 px-4 border-b border-border">
      <div className="container mx-auto">
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
      variant="custom"
      onClick={() => navigate(`/search?query=${encodeURIComponent(cat.value)}&from=chip`)}
      // Add neon-btn and the dynamic category class here:
      className={`
        neon-btn btn-${cat.value}
        h-9 w-full flex items-center justify-center gap-1.5 px-2
        text-[11px] font-medium whitespace-nowrap rounded-lg
        transition-colors md:h-10 md:w-auto md:px-4 md:text-sm
      `}
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
