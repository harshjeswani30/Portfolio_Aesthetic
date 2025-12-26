import { Toaster } from "@/components/ui/sonner";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import { SupabaseAuthProvider } from "@/components/providers/SupabaseAuthProvider";
import { ThemeProvider, useTheme } from "@/components/providers/ThemeProvider";
import { MetaTags } from "@/components/MetaTags";
import { DocumentHead } from "@/components/DocumentHead";
import { StrictMode, useEffect, lazy, Suspense, useRef } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import "./types/global.d.ts";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Expertise = lazy(() => import("./pages/Expertise.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Admin Components
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard.tsx"));
const ExpertiseManager = lazy(() => import("./pages/admin/ExpertiseManager.tsx"));
const TimelineManager = lazy(() => import("./pages/admin/TimelineManager.tsx"));
const PagesManager = lazy(() => import("./pages/admin/PagesManager.tsx"));
const GalleryManager = lazy(() => import("./pages/admin/GalleryManager.tsx"));
const FooterManager = lazy(() => import("./pages/admin/FooterManager.tsx"));
const MetaTagsManager = lazy(() => import("./pages/admin/MetaTagsManager.tsx"));
const Settings = lazy(() => import("./pages/admin/Settings.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return null;
}

// Component to enforce light mode only on Landing page
function ThemeRouteGuard() {
  const location = useLocation();
  const { setTheme } = useTheme();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Store Landing theme preference separately
    const landingThemeKey = 'landingTheme';
    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;
    
    // Pages that should always be in dark mode
    const darkModePages = ['/about', '/expertise', '/contact'];
    const isDarkModePage = darkModePages.includes(currentPath);
    
    // Always check and enforce theme for dark mode pages, even if path hasn't changed
    // This ensures theme is set correctly on initial load or when navigating to these pages
    if (isDarkModePage) {
      setTheme('dark');
      // If coming from landing, save the landing theme
      if (prevPath === '/') {
        const currentTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (currentTheme === 'light') {
          localStorage.setItem(landingThemeKey, 'light');
        }
      }
      prevPathRef.current = currentPath;
      return;
    }
    
    // Only run when route actually changes (not on initial mount if already on Landing)
    if (prevPath === currentPath) {
      return;
    }
    
    // Update prev path after checking
    const wasOnLanding = prevPath === '/';
    prevPathRef.current = currentPath;
    
    if (currentPath === '/') {
      // Just navigated TO Landing page: restore saved landing theme
      const savedLandingTheme = localStorage.getItem(landingThemeKey) as 'light' | 'dark' | null;
      if (savedLandingTheme) {
        setTheme(savedLandingTheme);
      } else {
        // First time on Landing page - default to dark
        setTheme('dark');
        localStorage.setItem(landingThemeKey, 'dark');
      }
    } else if (wasOnLanding) {
      // Just navigated AWAY from Landing: save current theme and force dark
      // Only force dark for non-admin pages
      if (currentPath !== '/admin' && !currentPath.startsWith('/admin/') && !currentPath.startsWith('/auth')) {
        // Save current theme as landing theme (check localStorage for current theme)
        const currentTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (currentTheme === 'light') {
          localStorage.setItem(landingThemeKey, 'light');
        }
        // Force dark mode on all non-admin pages
        setTheme('dark');
      }
    } else if (currentPath !== '/admin' && !currentPath.startsWith('/admin/') && !currentPath.startsWith('/auth')) {
      // For any other non-admin page, ensure dark mode
      setTheme('dark');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // Only run on route change

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <InstrumentationProvider>
        <SupabaseAuthProvider>
          <BrowserRouter>
          <MetaTags />
          <DocumentHead />
          <RouteSyncer />
          <ScrollToTop />
          <ThemeRouteGuard />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthPage redirectAfterAuth="/admin" />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/expertise" element={<Expertise />} />
              <Route path="/about" element={<About />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="expertise" element={<ExpertiseManager />} />
                <Route path="timeline" element={<TimelineManager />} />
                <Route path="pages" element={<PagesManager />} />
                <Route path="gallery" element={<GalleryManager />} />
                <Route path="footer" element={<FooterManager />} />
              <Route path="meta-tags" element={<MetaTagsManager />} />
              <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </BrowserRouter>
          <Toaster />
        </SupabaseAuthProvider>
      </InstrumentationProvider>
    </ThemeProvider>
  </StrictMode>,
);