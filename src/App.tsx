import { lazy, Suspense, useEffect } from "react";
import { App as CapApp } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Routes, Route, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { NavigationBar } from '@capgo/capacitor-navigation-bar';
import { Capacitor } from '@capacitor/core';

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
  const navType = useNavigationType();

  useEffect(() => {
    // Only force scroll to top if the user is clicking a new link.
    // If they click the "Back" button (POP), let the browser keep their scroll position!
    if (navType !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);

  return null;
};



/* 📱 NATIVE ANDROID HARDWARE BRIDGE */
const NativeHardwareBridge = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();


useEffect(() => {
    const setupUI = async () => {
      if (!Capacitor.isNativePlatform()) return;
      try {
        // We set the colors to black/dark style, but STRICTLY DO NOT trigger overlays
        // This allows our Android 15 XML Kill Switch to work flawlessly
        await StatusBar.setBackgroundColor({ color: '#000000' });
        await StatusBar.setStyle({ style: Style.Dark }); 
        await NavigationBar.setNavigationBarColor({ color: '#000000', darkButtons: false });
      } catch (e) {
        console.error("Hardware UI setup failed:", e);
      }
    };
    setupUI();
  }, []); // <-- Empty array stays



  // 2. HANDLE HARDWARE BACK BUTTON (Depends on route changes)
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const backListener = CapApp.addListener("backButton", () => {
      if (pathname === "/") {
        CapApp.exitApp();
      } else {
        navigate(-1);
      }
    });

    return () => {
      backListener.then((sub) => sub.remove());
    };
  }, [pathname, navigate]);

  return null;
};

const App = () => {
  return (
    <>
      <ScrollToTop />
      <NativeHardwareBridge />

      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/item/:id/:slug?" element={<ItemDetails />} />
          <Route path="/category/:category" element={<CategoryView />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/kavi-control-99" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/app" element={<GetApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;