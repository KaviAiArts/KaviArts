import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import ContentGrid from "@/components/ContentGrid";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Update page title and meta description for SEO
    document.title = "AnythingForYou - Free Wallpapers & Ringtones | Download HD Mobile Content";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Download millions of free HD wallpapers, ringtones, and customization content for your mobile devices. Personalize your phone with beautiful backgrounds and sounds.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <CategoryNav />
        <ContentGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;