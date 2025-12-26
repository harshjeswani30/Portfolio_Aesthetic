// simple logo dropdown component that can be used to go to the landing page or sign out for the user

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/providers/SupabaseAuthProvider";
import { Home, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router";
import { useLogoSettings } from "@/hooks/use-cms";
import { convertDriveUrlToDirectImageUrl } from "@/lib/image-utils";

export function LogoDropdown() {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: logoSettings } = useLogoSettings();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoAdmin = () => {
    navigate("/admin");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 relative">
          {logoSettings?.logoUrl ? (
            <>
              <img
                src={convertDriveUrlToDirectImageUrl(logoSettings.logoUrl)}
                alt="Logo"
                width={32}
                height={32}
                className="rounded-lg object-contain"
                onError={(e) => {
                  // Fallback to text if image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.logo-text-fallback') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div 
                className="logo-text-fallback hidden h-8 w-8 rounded-lg bg-primary text-primary-foreground font-bold items-center justify-center text-sm absolute inset-0"
              >
                {logoSettings?.logoText || 'CS'}
              </div>
            </>
          ) : (
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
              {logoSettings?.logoText || 'CS'}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={handleGoHome} className="cursor-pointer">
          <Home className="mr-2 h-4 w-4" />
          Landing Page
        </DropdownMenuItem>
        {isAuthenticated && (
          <>
            <DropdownMenuItem onClick={handleGoAdmin} className="cursor-pointer">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Admin Panel
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}