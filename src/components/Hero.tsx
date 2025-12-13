const Hero = () => {
  return (



    <section className="relative py-4 md:py-4 px-4 overflow-hidden">



      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />

      <div className="container mx-auto text-center relative z-10">
        {/* Title with float but visually centered */}
        <div className="animate-float translate-y-1">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Kavi</span>{" "}
            <span className="gradient-text">Arts</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-base md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          Images that Pop, Sounds that Rock, Videos that Talk
        </p>
      </div>
    </section>
  );
};

export default Hero;
