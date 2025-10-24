import { Button } from "@/components/ui/button";
import { Download, Smartphone, Music } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative py-3 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="animate-float">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text"> Kavi </span>
            <span className="text-foreground">  </span>
            <span className="gradient-text"> Arts </span>
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Images that Pop, Sounds that Rock, Videos that Talk
        </p>

      </div>
    </section>
  );
};

export default Hero;