import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Settings as SettingsIcon,
  LogOut,
  Clock,
  ChevronRight,
  Globe
} from "lucide-react";
import { useAuth } from "@/components/providers/SupabaseAuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLogoSettings } from "@/hooks/use-cms";
import { convertDriveUrlToDirectImageUrl } from "@/lib/image-utils";

type Theme = 'light' | 'dark';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout() {
  const location = useLocation();
  const { isAuthenticated, isLoading, signOut, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const originalThemeRef = useRef<Theme | null>(null);
  const { data: logoSettings } = useLogoSettings();

  // Force dark theme for admin panel
  useEffect(() => {
    // Store original theme before forcing dark
    if (originalThemeRef.current === null) {
      originalThemeRef.current = theme;
    }
    
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    
    return () => {
      // Restore original theme when leaving admin
      const originalTheme = originalThemeRef.current || 'dark';
      if (originalTheme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
      } else {
        root.classList.add('dark');
        root.classList.remove('light');
      }
      // Reset ref for next time
      originalThemeRef.current = null;
    };
  }, [theme]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
    { icon: Layers, label: "Expertise Cards", to: "/admin/expertise" },
    { icon: Clock, label: "Timeline", to: "/admin/timeline" },
    { icon: FileText, label: "Pages", to: "/admin/pages" },
    { icon: Layers, label: "Gallery", to: "/admin/gallery" },
    { icon: FileText, label: "Footer", to: "/admin/footer" },
    { icon: Globe, label: "Meta Tags", to: "/admin/meta-tags" },
    { icon: SettingsIcon, label: "Settings", to: "/admin/settings" },
  ];


  return (
    <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <Sidebar collapsible="icon" className="border-r border-white/10">
              <SidebarHeader className="p-4">
                <div className="flex items-center gap-3 px-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold overflow-hidden">
                    {logoSettings?.logoUrl ? (
                      <img
                        src={convertDriveUrlToDirectImageUrl(logoSettings.logoUrl)}
                        alt="Logo"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <span className={logoSettings?.logoUrl ? 'hidden' : ''} style={{ display: logoSettings?.logoUrl ? 'none' : 'block' }}>
                      {logoSettings?.logoText || 'CS'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                    <span className="font-bold">Admin Panel</span>
                    <span className="text-xs text-muted-foreground">v1.0.0</span>
                  </div>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Management</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navItems.map((item) => (
                        <SidebarMenuItem key={item.to}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={location.pathname === item.to}
                            tooltip={item.label}
                          >
                            <Link to={item.to}>
                              <item.icon />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className="p-4">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => signOut()}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut />
                      <span>Sign Out</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
              <SidebarRail />
            </Sidebar>
            
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
              <header className="flex h-16 items-center gap-4 border-b border-white/5 px-6 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-6 bg-white/10" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link to="/admin" className="hover:text-foreground transition-colors">Admin</Link>
                  {location.pathname !== "/admin" && (
                    <>
                      <ChevronRight className="h-4 w-4" />
                      <span className="text-foreground capitalize">
                        {location.pathname.split("/").pop()}
                      </span>
                    </>
                  )}
                </div>
              </header>
              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Outlet />
                </div>
              </div>
            </main>
          </div>
        </SidebarProvider>
  );
}