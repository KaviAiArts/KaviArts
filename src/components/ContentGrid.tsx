import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Download, Heart, Eye, Play, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import wallpaper1 from "@/assets/sample-wallpaper-1.jpg";
import wallpaper2 from "@/assets/sample-wallpaper-2.jpg";
import wallpaper3 from "@/assets/sample-wallpaper-3.jpg";

// Sample data - Replace this with real data from your database
const newestWallpapers = [
  {
    id: "sunset-beach",
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
  {
    id: 4,
    title: "Neon Dreams",
    image: wallpaper1,
    downloads: "1.8K",
    likes: "234",
    views: "9.2K",
    type: "wallpaper"
  },
  {
    id: 5,
    title: "Digital Ocean",
    image: wallpaper2,
    downloads: "4.1K",
    likes: "567",
    views: "15.3K",
    type: "wallpaper"
  },
  {
    id: 6,
    title: "Space Galaxy",
    image: wallpaper3,
    downloads: "6.7K",
    likes: "789",
    views: "28.4K",
    type: "wallpaper"
  }
];

const popularWallpapers = [
  {
    id: 7,
    title: "Mountain Peak",
    image: wallpaper3,
    downloads: "12.5K",
    likes: "2.1K",
    views: "45.7K",
    type: "wallpaper"
  },
  {
    id: 8,
    title: "Ocean Waves",
    image: wallpaper1,
    downloads: "8.9K",
    likes: "1.5K",
    views: "32.1K",
    type: "wallpaper"
  },
  {
    id: 9,
    title: "Forest Path",
    image: wallpaper2,
    downloads: "15.2K",
    likes: "3.2K",
    views: "67.8K",
    type: "wallpaper"
  },
  {
    id: 10,
    title: "City Lights",
    image: wallpaper3,
    downloads: "9.7K",
    likes: "1.8K",
    views: "38.5K",
    type: "wallpaper"
  },
  {
    id: 11,
    title: "Sunset Sky",
    image: wallpaper1,
    downloads: "11.3K",
    likes: "2.0K",
    views: "41.9K",
    type: "wallpaper"
  },
  {
    id: 12,
    title: "Desert Dunes",
    image: wallpaper2,
    downloads: "7.6K",
    likes: "1.3K",
    views: "29.4K",
    type: "wallpaper"
  }
];

const popularRingtones = [
  {
    id: 13,
    title: "Electronic Beat",
    image: "🎵", // Placeholder - replace with actual audio waveform images
    downloads: "5.4K",
    likes: "892",
    views: "18.2K",
    type: "ringtone",
    duration: "0:30"
  },
  {
    id: 14,
    title: "Classic Bell",
    image: "🔔",
    downloads: "8.1K",
    likes: "1.2K",
    views: "25.7K",
    type: "ringtone",
    duration: "0:25"
  },
  {
    id: 15,
    title: "Nature Sounds",
    image: "🌿",
    downloads: "3.9K",
    likes: "654",
    views: "14.8K",
    type: "ringtone",
    duration: "0:35"
  },
  {
    id: 16,
    title: "Pop Melody",
    image: "🎶",
    downloads: "7.2K",
    likes: "1.1K",
    views: "22.3K",
    type: "ringtone",
    duration: "0:28"
  },
  {
    id: 17,
    title: "Rock Guitar",
    image: "🎸",
    downloads: "6.8K",
    likes: "987",
    views: "21.1K",
    type: "ringtone",
    duration: "0:32"
  },
  {
    id: 18,
    title: "Piano Notes",
    image: "🎹",
    downloads: "4.5K",
    likes: "743",
    views: "17.6K",
    type: "ringtone",
    duration: "0:27"
  }
];

const popularVideos = [
  {
    id: 19,
    title: "Ocean Waves",
    image: wallpaper1, // Use as video thumbnail
    downloads: "2.1K",
    likes: "345",
    views: "8.9K",
    type: "video",
    duration: "1:45"
  },
  {
    id: 20,
    title: "Rain Forest",
    image: wallpaper2,
    downloads: "3.4K",
    likes: "567",
    views: "12.7K",
    type: "video",
    duration: "2:15"
  },
  {
    id: 21,
    title: "Fire Animation",
    image: wallpaper3,
    downloads: "4.7K",
    likes: "789",
    views: "16.3K",
    type: "video",
    duration: "1:30"
  },
  {
    id: 22,
    title: "Galaxy Zoom",
    image: wallpaper1,
    downloads: "5.2K",
    likes: "834",
    views: "19.8K",
    type: "video",
    duration: "2:00"
  },
  {
    id: 23,
    title: "Particles Flow",
    image: wallpaper2,
    downloads: "3.8K",
    likes: "612",
    views: "14.5K",
    type: "video",
    duration: "1:55"
  },
  {
    id: 24,
    title: "Neon Glow",
    image: wallpaper3,
    downloads: "6.1K",
    likes: "923",
    views: "23.4K",
    type: "video",
    duration: "1:40"
  }
];

// Reusable Content Item Component
const ContentItem = ({ item }: { item: any }) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/item/${item.id}`);
  };

  const getIcon = () => {
    switch (item.type) {
      case 'ringtone':
        return <Music className="w-4 h-4 mr-2" />;
      case 'video':
        return <Play className="w-4 h-4 mr-2" />;
      default:
        return <Download className="w-4 h-4 mr-2" />;
    }
  };

  const renderPreview = () => {
    if (item.type === 'ringtone') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-6xl">
          {item.image}
        </div>
      );
    }
    
    return (
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
    );
  };

  return (
    <Card className="group glass-card hover-lift overflow-hidden cursor-pointer" onClick={handleItemClick}>
      <div className="relative aspect-[9/16] overflow-hidden">
        {renderPreview()}
        
        {/* Play button for videos */}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 rounded-full p-3">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow">
            {getIcon()}
            {item.type === 'video' ? 'Watch' : item.type === 'ringtone' ? 'Listen' : 'Download'}
          </Button>
        </div>

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full">
            {item.type}
          </span>
        </div>

        {/* Duration badge for videos and ringtones */}
        {item.duration && (
          <div className="absolute top-2 right-2">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {item.duration}
            </span>
          </div>
        )}
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
  );
};

// Reusable Content Section Component
const ContentSection = ({ title, items, category }: { title: string; items: any[]; category: string }) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate(`/category/${category}`);
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Button variant="outline" size="sm" onClick={handleViewAll}>
            View All
          </Button>
        </div>

        {/* Desktop: 6 items in a row */}
        <div className="hidden lg:grid lg:grid-cols-6 gap-6">
          {items.map((item) => (
            <ContentItem key={item.id} item={item} />
          ))}
        </div>

        {/* Mobile & Tablet: Show 2.5 items without arrows */}
        <div className="lg:hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`flex-shrink-0 ${index === 0 ? 'ml-4' : ''} ${index === items.length - 1 ? 'mr-4' : ''}`}
                  style={{ width: 'calc((100vw - 2rem) / 2.5)' }}
                >
                  <ContentItem item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContentGrid = () => {
  return (
    <div>
      {/* Newest Wallpapers */}
      <ContentSection 
        title="Newest Wallpapers" 
        items={newestWallpapers} 
        category="wallpapers" 
      />
      
      {/* Popular Wallpapers */}
      <ContentSection 
        title="Popular Wallpapers" 
        items={popularWallpapers} 
        category="wallpapers" 
      />
      
      {/* Popular Ringtones */}
      <ContentSection 
        title="Popular Ringtones" 
        items={popularRingtones} 
        category="ringtones" 
      />
      
      {/* Popular Videos */}
      <ContentSection 
        title="Popular Videos" 
        items={popularVideos} 
        category="videos" 
      />
    </div>
  );
};

export default ContentGrid;