import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Index from "@/pages/Index";
import ItemDetails from "@/pages/ItemDetails";
import CategoryView from "@/pages/CategoryView";
import SearchResults from "@/pages/SearchResults";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

/* ✅ SUPPORT PAGES */
import About from "@/pages/About";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Contact from "@/pages/Contact";
import GetApp from "@/pages/GetApp";

/* 🔒 SAFE SCROLL STABILIZER */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Index />} />

        {/* SEO-friendly item URL */}
        <Route path="/item/:id/:slug?" element={<ItemDetails />} />

        {/* CORE ROUTES */}
        <Route path="/category/:category" element={<CategoryView />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/admin" element={<Admin />} />

        {/* SUPPORT ROUTES */}
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/app" element={<GetApp />} />

        {/* FALLBACK */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
