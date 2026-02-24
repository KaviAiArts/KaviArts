const Hero = () => {
  return (
    <section className="hidden md:block relative py-4 md:py-4 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />

<div className="container mx-auto text-center relative z-10 hero-box">
        {/* Prevent CLS */}
<div className="flex items-center justify-center">
          <div className="animate-float will-change-transform">
            <h1 className="text-4xl md:text-6xl font-bold mt-0 mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
  Kavi Arts
</h1>
          </div>
        </div>

        <p className="text-lg md:text-2xl font-medium text-white/80 tracking-wide">
  Images that Pop | Sounds that Rock | Videos that Talk
</p>
      </div>
    </section>
  );
};

export default Hero;
