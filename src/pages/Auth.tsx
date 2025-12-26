import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/SupabaseAuthProvider";
import { ArrowRight, Loader2, Lock, KeyRound } from "lucide-react";
import { Suspense, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";
import { useLogoSettings } from "@/hooks/use-cms";
import { convertDriveUrlToDirectImageUrl } from "@/lib/image-utils";

interface AuthProps {
  redirectAfterAuth?: string;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const originalThemeRef = useRef<string | null>(null);
  const { data: logoSettings } = useLogoSettings();

  // Force dark theme for auth page
  useEffect(() => {
    // Store original theme
    originalThemeRef.current = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    
    // Force dark theme
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    
    // Cleanup: restore original theme when component unmounts
    return () => {
      if (originalThemeRef.current === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    };
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = redirectAfterAuth || "/admin";
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirectAfterAuth]);

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    const email = (formData.get("email") as string).toLowerCase();
    const password = formData.get("password") as string;
    
    try {
      // Check if user exists in users table first (must be pre-approved admin)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();  // Use maybeSingle() instead of single() to handle no results gracefully

      console.log('User lookup result:', { userData, userError, email: email.toLowerCase() });

      if (userError) {
        console.error('User lookup error:', userError);
        setError(`Database error: ${userError.message}. Please check DEBUG_AUTH_ISSUE.md`);
        setIsLoading(false);
        return;
      }

      if (!userData) {
        console.error('User not found in public.users table');
        setError("Access denied. Account not found. Only pre-approved administrators can access. Please check QUICK_FIX_ADMIN_ACCESS.md for setup instructions.");
        setIsLoading(false);
        return;
      }

      if (!(userData as any)?.is_admin) {
        setError("Access denied. You don't have administrator privileges.");
        setIsLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      
      // Success - auth state will update automatically
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Invalid credentials. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex items-center justify-center h-full flex-col w-full max-w-md">
          <Card className="w-full border-white/10 bg-card/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/10">
                  {logoSettings?.logoUrl ? (
                    <img
                      src={convertDriveUrlToDirectImageUrl(logoSettings.logoUrl)}
                      alt="Logo"
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.nextElementSibling) {
                          (target.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    className={`text-primary font-bold text-xl ${logoSettings?.logoUrl ? 'hidden' : ''}`}
                    style={{ display: logoSettings?.logoUrl ? 'none' : 'flex' }}
                  >
                    {logoSettings?.logoText || 'CS'}
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl font-display tracking-tight">
                Admin Access
              </CardTitle>
              <CardDescription>
                Enter your credentials to access the dashboard
              </CardDescription>
            </CardHeader>

            <form onSubmit={handlePasswordSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      placeholder="admin@example.com"
                      type="email"
                      className="pl-9 bg-background/50 border-white/10"
                      disabled={isLoading}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      type="password"
                      className="pl-9 bg-background/50 border-white/10"
                      disabled={isLoading}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </form>

            <div className="py-4 px-6 text-xs text-center text-muted-foreground bg-white/5 border-t border-white/10 rounded-b-lg">
              Secure Admin Access
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}