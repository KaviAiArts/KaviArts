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

// ⭐ Search Page (Make sure this file exists!)
import SearchResults from "./pages/SearchResults";

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

          {/* ⭐ Search Results Page */}
          <Route path="/search" element={<SearchResults />} />

          {/* Admin */}
          <Route path="/admin" element={<Admin />} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
