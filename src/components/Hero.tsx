import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] px-4 overflow-hidden flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>

      {/* Centered Content */}
      <div className="container mx-auto text-center relative z-10 flex flex-col items-center justify-center translate-y-2">
        {/* Floating title */}
        <div className="animate-float mb-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="gradient-text">Kavi</span>{" "}
            <span className="gradient-text">Arts</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl">
          Images that Pop, Sounds that Rock, Videos that Talk
        </p>
      </div>
    </section>
  );
};

export default Hero;
