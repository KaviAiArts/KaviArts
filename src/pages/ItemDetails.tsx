import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Heart, Eye, Share2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Sample data - in real app this would come from your database
const sampleItems = {
  "sunset-beach": {
    id: "sunset-beach",
    title: "Sunset Beach Paradise",
    image: "/src/assets/sample-wallpaper-1.jpg",
    type: "wallpaper",
    downloads: "1.2K",
    likes: "856",
    views: "12.3K",
    description: "A breathtaking sunset over a pristine beach with golden sands and crystal clear waters. Perfect for your mobile wallpaper.",
    tags: ["sunset", "beach", "nature", "golden hour", "peaceful"],
    resolution: "1080x1920",
    size: "2.3 MB",
    uploadDate: "2024-01-15"
  },
  // Add more sample items as needed
};

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    // In real app, fetch item data from API/database
    const itemData = sampleItems[id as keyof typeof sampleItems];
    setItem(itemData);

    if (itemData) {
      document.title = `${itemData.title} - KaviArts`;
    }
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Item not found</h1>
            <Button onClick={() => navigate("/")}>Go Back Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Preview */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-auto max-h-[600px] object-cover"
              />
            </Card>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{item.type}</Badge>
                {item.resolution && <Badge variant="outline">{item.resolution}</Badge>}
              </div>
              <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
              <p className="text-muted-foreground text-lg">{item.description}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {item.downloads}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {item.likes}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {item.views}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* File Info */}
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Size:</span>
                <span className="text-sm font-medium">{item.size}</span>
              </div>
              {item.resolution && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Resolution:</span>
                  <span className="text-sm font-medium">{item.resolution}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Upload Date:</span>
                <span className="text-sm font-medium">{item.uploadDate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ItemDetails;