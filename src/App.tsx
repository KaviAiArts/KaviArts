import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ItemDetails from "./pages/ItemDetails";
import CategoryView from "./pages/CategoryView";
import Admin from "./pages/Admin";
import SearchResults from "./pages/SearchResults";

/* ✅ SUPPORT PAGES */
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import GetApp from "./pages/GetApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Index />} />

          {/* Item Detail */}
          <Route path="/item/:id" element={<ItemDetails />} />

          {/* Category View */}
          <Route path="/category/:category" element={<CategoryView />} />

          {/* Search */}
          <Route path="/search" element={<SearchResults />} />

          {/* Support Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/app" element={<GetApp />} />

          {/* Admin */}
          <Route path="/admin" element={<Admin />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
