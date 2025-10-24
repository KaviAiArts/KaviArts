import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Heart, Eye, Play, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Sample data - in real app this would come from your database
const categoryData = {
  wallpapers: {
    title: "Wallpapers",
    items: [
      {
        id: "sunset-beach",
        title: "Sunset Beach Paradise",
        image: "/src/assets/sample-wallpaper-1.jpg",
        type: "wallpaper",
        downloads: "1.2K",
        likes: "856",
        views: "12.3K"
      },
      {
        id: "mountain-view",
        title: "Mountain View",
        image: "/src/assets/sample-wallpaper-2.jpg",
        type: "wallpaper",
        downloads: "980",
        likes: "642",
        views: "8.7K"
      },
      {
        id: "city-nights",
        title: "City Nights",
        image: "/src/assets/sample-wallpaper-3.jpg",
        type: "wallpaper",
        downloads: "1.5K",
        likes: "1.1K",
        views: "15.2K"
      },
      // Add more wallpapers...
    ]
  },
  ringtones: {
    title: "Ringtones",
    items: [
      {
        id: "ringtone-1",
        title: "Melodic Chime",
        type: "ringtone",
        downloads: "2.3K",
        likes: "1.8K",
        views: "25.1K",
        duration: "0:30"
      },
      // Add more ringtones...
    ]
  },
  videos: {
    title: "Videos",
    items: [
      {
        id: "video-1",
        title: "Nature Scene",
        image: "/src/assets/sample-wallpaper-1.jpg",
        type: "video",
        downloads: "856",
        likes: "642",
        views: "12.5K",
        duration: "1:45"
      },
      // Add more videos...
    ]
  }
};

const CategoryView = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const categoryInfo = categoryData[category as keyof typeof categoryData];
    setData(categoryInfo);

    if (categoryInfo) {
      document.title = `${categoryInfo.title} - AnythingForYou`;
    }
  }, [category]);

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Category not found</h1>
            <Button onClick={() => navigate("/")}>Go Back Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleItemClick = (itemId: string) => {
    navigate(`/item/${itemId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
          <p className="text-muted-foreground">
            Discover our collection of {data.items.length} amazing {data.title.toLowerCase()}
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data.items.map((item: any) => (
            <Card 
              key={item.id} 
              className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => handleItemClick(item.id)}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    {item.type === "ringtone" ? (
                      <Music className="w-12 h-12 text-primary" />
                    ) : (
                      <Play className="w-12 h-12 text-primary" />
                    )}
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button variant="secondary" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>

                {/* Type Badge */}
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.type}
                  </Badge>
                </div>

                {/* Duration Badge (for videos/ringtones) */}
                {item.duration && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="text-xs bg-black/50 text-white border-white/20">
                      {item.duration}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3 space-y-2">
                <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {item.downloads}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {item.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.views}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryView;