import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Play, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContentItem = ({ item }) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/item/${item.id}`);
  };

  const getIcon = () => {
    switch (item.file_type) {
      case "ringtone":
        return <Music className="w-4 h-4 mr-2" />;
      case "video":
        return <Play className="w-4 h-4 mr-2" />;
      default:
        return <Download className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <Card
      className="group glass-card hover-lift overflow-hidden cursor-pointer"
      onClick={handleItemClick}
    >
      

<div
  className={`relative overflow-hidden ${
    item.file_type === "ringtone"
      ? "aspect-square"
      : "aspect-[9/16]"
  }`}
>



        {item.file_type !== "ringtone" ? (
          <img
            src={item.file_url}
            alt={item.file_name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-6xl">
            🎵
          </div>
        )}



       {item.file_type === "video" && (
  <>
    <img
      src={item.file_url.replace("/upload/", "/upload/so_0/") + ".jpg"}
      alt={item.file_name}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-black/50 rounded-full p-3">
        <Play className="w-8 h-8 text-white fill-white" />
      </div>
    </div>
  </>
)}



        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow">
            {getIcon()}
            {item.file_type === "video"
              ? "Watch"
              : item.file_type === "ringtone"
              ? "Listen"
              : "Download"}
          </Button>
        </div>

        <div className="absolute top-2 left-2">
          <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full">
            {item.file_type}
          </span>
        </div>
      </div>


      <div className="p-4">
  <h3 className="font-semibold text-sm mb-1 truncate">


{item.file_name}</h3>
      </div>
    </Card>
  );
};

export default ContentItem;
