import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

/* ⚡ LAZY LOAD PAGES (Fixes Mobile Stats) */
const Index = lazy(() => import("@/pages/Index"));
const ItemDetails = lazy(() => import("@/pages/ItemDetails"));
const CategoryView = lazy(() => import("@/pages/CategoryView"));
const SearchResults = lazy(() => import("@/pages/SearchResults"));
const Admin = lazy(() => import("@/pages/Admin"));
const NotFound = lazy(() => import("@/pages/NotFound"));

/* ✅ SUPPORT PAGES (Lazy Loaded) */
const About = lazy(() => import("@/pages/About"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Contact = lazy(() => import("@/pages/Contact"));
const GetApp = lazy(() => import("@/pages/GetApp"));

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
      
      {/* ⚡ SUSPENSE WRAPPER (Required for Lazy Loading) */}
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
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
      </Suspense>
    </BrowserRouter>
  );
};

export default App;