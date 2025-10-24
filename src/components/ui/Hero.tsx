import { Button } from "@/components/ui/button";
import { Download, Smartphone, Music } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="animate-float">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Anything</span>
            <span className="text-foreground"> For </span>
            <span className="gradient-text">You</span>
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Discover millions of wallpapers, ringtones, and customization content for your devices. 
          Everything you need to personalize your digital world.
        </p>

      </div>
    </section>
  );
};

export default Hero;