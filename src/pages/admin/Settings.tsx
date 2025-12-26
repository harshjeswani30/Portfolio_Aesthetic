import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Mail, Lock, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/components/providers/SupabaseAuthProvider";
import { supabase } from "@/lib/supabase";
import { useProfileCardSettings, useUpdateProfileCardSettings, useLogoSettings, useUpdateLogoSettings } from "@/hooks/use-cms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { convertDriveUrlToDirectImageUrl } from "@/lib/image-utils";

export default function Settings() {
  const { user, profile, signOut } = useAuth();
  
  const [credentials, setCredentials] = useState({
    newName: "",
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "card" | "logo">("profile");
  
  // Profile card settings
  const { data: profileCardSettings, isLoading: loadingCardSettings } = useProfileCardSettings();
  const { mutate: updateProfileCard, isLoading: isUpdatingCard } = useUpdateProfileCardSettings();
  const [cardImageUrl, setCardImageUrl] = useState("");
  
  // Logo settings
  const { data: logoSettings, isLoading: loadingLogoSettings } = useLogoSettings();
  const { mutate: updateLogo, isLoading: isUpdatingLogo } = useUpdateLogoSettings();
  const [logoUrl, setLogoUrl] = useState("");
  const [logoText, setLogoText] = useState("CS");
  const [faviconUrl, setFaviconUrl] = useState("");
  
  // Initialize form when settings load
  useEffect(() => {
    if (profileCardSettings) {
      setCardImageUrl(profileCardSettings.cardImageUrl || "");
    }
  }, [profileCardSettings]);

  // Initialize logo form when settings load
  useEffect(() => {
    if (logoSettings) {
      setLogoUrl(logoSettings.logoUrl || "");
      setLogoText(logoSettings.logoText || "CS");
      setFaviconUrl(logoSettings.faviconUrl || "");
    }
  }, [logoSettings]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updates: any = {};
      
      // Update name if changed
      if (credentials.newName && credentials.newName !== profile?.name) {
        updates.name = credentials.newName;
      }
      
      // Update email if changed
      if (credentials.newEmail && credentials.newEmail !== user?.email) {
        // Check if email is already taken
        const { data: existingUser } = await (supabase
          .from('users')
          .select('id')
          .eq('email', credentials.newEmail.toLowerCase())
          .single() as any);

        if (existingUser && (existingUser as any).id !== user?.id) {
          throw new Error("Email already in use");
        }

        // Update email in Supabase Auth
        const { error: emailError } = await supabase.auth.updateUser({
          email: credentials.newEmail.toLowerCase(),
        });

        if (emailError) throw emailError;
        
        updates.email = credentials.newEmail.toLowerCase();
        toast.info("Email update requested. Please check your email to confirm the change.");
      }

      // Update profile in public.users table
      if (Object.keys(updates).length > 0 && user?.id) {
        const result = await ((supabase.from('users') as any)
          .update(updates)
          .eq('id', user.id));

        if (result.error) throw result.error;
      }

      if (Object.keys(updates).length === 0) {
        toast.info("No changes to save");
        setIsUpdating(false);
        return;
      }

      toast.success("Profile updated successfully!");
      
      // Reset form
      setCredentials({
        ...credentials,
        newName: "",
        newEmail: "",
      });

      // If email was changed, sign out to require re-authentication
      if (updates.email) {
        setTimeout(async () => {
          await signOut();
          window.location.href = "/auth";
        }, 2000);
      } else {
        // Reload to get updated profile
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Validate passwords
      if (!credentials.currentPassword) {
        throw new Error("Current password is required");
      }

      if (!credentials.newPassword || credentials.newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters");
      }

      if (credentials.newPassword !== credentials.confirmPassword) {
        throw new Error("New passwords do not match");
      }

      if (credentials.currentPassword === credentials.newPassword) {
        throw new Error("New password must be different from current password");
      }

      // Verify current password by attempting to sign in
      if (user?.email) {
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: credentials.currentPassword,
        });

        if (verifyError) {
          throw new Error("Current password is incorrect");
        }
      }

      // Update password in Supabase Auth
      const { error: passwordError } = await supabase.auth.updateUser({
        password: credentials.newPassword,
      });

      if (passwordError) {
        throw passwordError;
      }

      toast.success("Password updated successfully!");
      
      // Reset form
      setCredentials({
        ...credentials,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to update password");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileCard({
        cardImageUrl: cardImageUrl.trim()
      });
      toast.success("Profile card images updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile card");
    }
  };

  const handleUpdateLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateLogo({
        logoUrl: logoUrl.trim(),
        logoText: logoText.trim() || "CS",
        faviconUrl: faviconUrl.trim()
      });
      toast.success("Logo settings updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update logo settings");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Manage your admin account credentials and security.</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="bg-card/50 border border-white/5 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="card">Profile Card</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="max-w-2xl">
        {/* Profile Settings */}
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your name and email address. You'll need to verify email changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <Label>Current Email</Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/5">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{user?.email || profile?.email || "Loading..."}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Name</Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/5">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{profile?.name || "Not set"}</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>New Name</Label>
                  <Input 
                    value={credentials.newName}
                    onChange={(e) => setCredentials({...credentials, newName: e.target.value})}
                    placeholder={profile?.name || "Enter new name"}
                  />
                </div>

                <div className="space-y-2">
                  <Label>New Email</Label>
                  <Input 
                    type="email"
                    value={credentials.newEmail}
                    onChange={(e) => setCredentials({...credentials, newEmail: e.target.value})}
                    placeholder={user?.email || "Enter new email"}
                  />
                  <p className="text-xs text-muted-foreground">
                    You'll receive a confirmation email to verify the new address.
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        </TabsContent>

        <TabsContent value="password" className="max-w-2xl">
        {/* Password Settings */}
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <div className="relative">
                  <Input 
                    type={showCurrentPassword ? "text" : "password"}
                    value={credentials.currentPassword}
                    onChange={(e) => setCredentials({...credentials, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <Input 
                    type={showNewPassword ? "text" : "password"}
                    value={credentials.newPassword}
                    onChange={(e) => setCredentials({...credentials, newPassword: e.target.value})}
                    placeholder="Enter new password (min. 6 characters)"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <div className="relative">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={credentials.confirmPassword}
                    onChange={(e) => setCredentials({...credentials, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Make sure your new password is strong and unique. You'll stay logged in after changing it.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        </TabsContent>

        <TabsContent value="card" className="max-w-2xl">
        {/* Profile Card Image Settings */}
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Profile Card Image
            </CardTitle>
            <CardDescription>
              Update the profile card image displayed on the About page. You can use image URLs or upload to Supabase Storage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateCard} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cardImageUrl">Card Image URL</Label>
                <Input 
                  id="cardImageUrl"
                  type="url"
                  value={cardImageUrl}
                  onChange={(e) => setCardImageUrl(e.target.value)}
                  placeholder="https://example.com/card-image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  URL to the image that will be displayed on the 3D card. Leave empty to use default.
                </p>
                {cardImageUrl && (
                  <div className="mt-2 p-2 border border-white/10 rounded-lg">
                    <img 
                      src={convertDriveUrlToDirectImageUrl(cardImageUrl)} 
                      alt="Card preview" 
                      className="max-w-full h-32 object-contain rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>


              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  <ImageIcon className="w-4 h-4 inline mr-2" />
                  Tip: You can upload images to Supabase Storage and use the public URL here, or use any publicly accessible image URL.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isUpdatingCard}>
                {isUpdatingCard ? "Updating..." : "Update Profile Card Images"}
              </Button>
            </form>
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="logo" className="max-w-2xl">
        {/* Logo Settings */}
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Logo Settings
            </CardTitle>
            <CardDescription>
              Manage your website logo, logo text fallback, and favicon. These appear throughout the site including footer, admin panel, and auth page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateLogo} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo Image URL</Label>
                <Input 
                  id="logoUrl"
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.svg"
                />
                <p className="text-xs text-muted-foreground">
                  URL to your logo image (SVG, PNG, or JPG). This will be used in the footer, admin panel, and auth page. If the image fails to load, the logo text will be used as a fallback. Google Drive sharing URLs are automatically converted to direct image URLs.
                </p>
                {logoUrl && (
                  <div className="mt-2 p-4 border border-white/10 rounded-lg bg-background/50">
                    <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                        <img 
                          src={convertDriveUrlToDirectImageUrl(logoUrl)} 
                          alt="Logo preview" 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="hidden h-full w-full bg-primary rounded-lg items-center justify-center text-white font-bold text-sm">
                          {logoText || "CS"}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">Logo size: 40x40px</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoText">Logo Text (Fallback)</Label>
                <Input 
                  id="logoText"
                  type="text"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  placeholder="CS"
                  maxLength={10}
                />
                <p className="text-xs text-muted-foreground">
                  Text to display if the logo image fails to load or is not provided. This appears in a colored box as a fallback (e.g., "CS", "Logo").
                </p>
                {logoText && (
                  <div className="mt-2 p-4 border border-white/10 rounded-lg bg-background/50">
                    <p className="text-xs text-muted-foreground mb-2">Text Fallback Preview:</p>
                    <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                      {logoText}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="faviconUrl">Favicon URL (Optional)</Label>
                <Input 
                  id="faviconUrl"
                  type="url"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                />
                <p className="text-xs text-muted-foreground">
                  URL to your favicon (the small icon shown in browser tabs). Common formats: .ico, .png, .svg. Leave empty to use the default.
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  <ImageIcon className="w-4 h-4 inline mr-2" />
                  <strong>Where logos appear:</strong> Footer (landing page), Admin Panel header, Auth/Login page, Logo Dropdown menu. If no logo URL is provided, the logo text will be displayed in a colored box.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isUpdatingLogo || loadingLogoSettings}>
                {isUpdatingLogo ? "Updating..." : loadingLogoSettings ? "Loading..." : "Update Logo Settings"}
              </Button>
            </form>
          </CardContent>
        </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
