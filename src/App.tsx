import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import ItemDetails from "@/pages/ItemDetails";
import CategoryView from "@/pages/CategoryView";
import SearchResults from "@/pages/SearchResults";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />

        {/* ✅ SEO-friendly item URL */}
        <Route path="/item/:id/:slug?" element={<ItemDetails />} />

        <Route path="/category/:category" element={<CategoryView />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/admin" element={<Admin />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
