import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Heart, Eye, Clock } from "lucide-react";
import wallpaper1 from "@/assets/sample-wallpaper-1.jpg";
import wallpaper2 from "@/assets/sample-wallpaper-2.jpg";
import wallpaper3 from "@/assets/sample-wallpaper-3.jpg";

const contentItems = [
  {
    id: 1,
    title: "Abstract Gradients",
    image: wallpaper1,
    downloads: "2.3K",
    likes: "456",
    views: "12.5K",
    type: "wallpaper"
  },
  {
    id: 2,
    title: "Cyberpunk City",
    image: wallpaper2,
    downloads: "5.8K",
    likes: "892",
    views: "24.1K",
    type: "wallpaper"
  },
  {
    id: 3,
    title: "Aurora Lights",
    image: wallpaper3,
    downloads: "3.2K",
    likes: "634",
    views: "18.7K",
    type: "wallpaper"
  },
  // Duplicate items to show grid layout
  {
    id: 4,
    title: "Abstract Gradients",
    image: wallpaper1,
    downloads: "2.3K",
    likes: "456",
    views: "12.5K",
    type: "wallpaper"
  },
  {
    id: 5,
    title: "Cyberpunk City",
    image: wallpaper2,
    downloads: "5.8K",
    likes: "892",
    views: "24.1K",
    type: "wallpaper"
  },
  {
    id: 6,
    title: "Aurora Lights",
    image: wallpaper3,
    downloads: "3.2K",
    likes: "634",
    views: "18.7K",
    type: "wallpaper"
  }
];

const ContentGrid = () => {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Wallpapers</h2>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Updated daily</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {contentItems.map((item) => (
            <Card key={item.id} className="group glass-card hover-lift overflow-hidden">
              <div className="relative aspect-[9/16] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>

                {/* Type badge */}
                <div className="absolute top-2 left-2">
                  <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {item.type}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-sm mb-3 truncate">{item.title}</h3>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Download className="w-3 h-3" />
                    <span>{item.downloads}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{item.views}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-border hover:bg-secondary">
            Load More Content
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContentGrid;