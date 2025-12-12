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
import SearchResults from "./pages/SearchResults";   // ⭐ ADDED

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/category/:category" element={<CategoryView />} />

          {/* ⭐ SEARCH PAGE */}
          <Route path="/search" element={<SearchResults />} />

          {/* ADMIN */}
          <Route path="/admin" element={<Admin />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
