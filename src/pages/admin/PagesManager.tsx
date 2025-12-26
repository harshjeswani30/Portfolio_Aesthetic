import { useState, useEffect } from "react";
import { usePage, useUpdatePage, useSiteSettings, useAboutFooterText, useUpdateAboutFooterText } from "@/hooks/use-cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { SocialLinksEditor, type SocialLink } from "@/components/admin/SocialLinksEditor";

export default function PagesManager() {
  const [activeTab, setActiveTab] = useState("home");
  
  const { data: homePage } = usePage("home");
  const { data: aboutPage } = usePage("about");
  const { data: contactPage } = usePage("contact");
  const { data: siteSettings } = useSiteSettings();
  const { mutate: updatePage, isLoading: isUpdating } = useUpdatePage();

  const handleSave = async (slug: string, data: any) => {
    try {
      await updatePage(slug, data, slug.charAt(0).toUpperCase() + slug.slice(1));
      toast.success("Page updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update page");
    }
  };

  const handleSiteSettingsSave = async (settings: { headerTitle: string; pageTitle: string; faviconUrl: string }) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: 'general', value: settings } as any, { onConflict: 'key' });
      if (error) throw error;
      toast.success("Site settings updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Page Content</h1>
        <p className="text-muted-foreground">Manage text and content for your pages.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-card/50 border border-white/5">
          <TabsTrigger value="home">Home / Landing</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="mt-6">
          <HomeEditor 
            initialData={(homePage as any)?.content} 
            onSave={(data) => handleSave("home", data)} 
          />
        </TabsContent>

        <TabsContent value="about" className="mt-6 space-y-6">
          <AboutEditor 
            initialData={(aboutPage as any)?.content} 
            onSave={(data) => handleSave("about", data)} 
          />
          <AboutFooterTextEditor />
        </TabsContent>
        
        <TabsContent value="contact" className="mt-6">
          <ContactEditor 
            initialData={(contactPage as any)?.content} 
            onSave={(data) => handleSave("contact", data)} 
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <SiteSettingsEditor initialData={siteSettings} onSave={handleSiteSettingsSave} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HomeEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    heroTitle1: "PORT",
    heroTitle2: "FOLIO",
    videoUrl: "https://videos.pexels.com/video-files/5377684/5377684-uhd_2560_1440_25fps.mp4",
    finalVideoUrl: "https://videos.pexels.com/video-files/3222356/3222356-hd_1920_1080_25fps.mp4",
    bottomTextLeftTitle: "CINEMATIC",
    bottomTextLeftSubtitle: "Showreel 2024",
    bottomTextRightTitle: "STRATEGY",
    bottomTextRightSubtitle: "Creative Direction",
    ...initialData
  });

  useEffect(() => {
    if (initialData) setFormData({ ...formData, ...initialData });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card className="bg-card/50 border-white/5">
      <CardHeader>
        <CardTitle>Landing Page</CardTitle>
        <CardDescription>Customize the main hero section.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Hero Title Part 1</Label>
            <Input name="heroTitle1" value={formData.heroTitle1} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Hero Title Part 2</Label>
            <Input name="heroTitle2" value={formData.heroTitle2} onChange={handleChange} />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Main Video URL</Label>
          <Input name="videoUrl" value={formData.videoUrl} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label>Second Video URL (After GSAP Text Animation)</Label>
          <Input name="finalVideoUrl" value={formData.finalVideoUrl} onChange={handleChange} />
          <p className="text-xs text-muted-foreground">This video appears after the horizontal scrolling text animation section.</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4 border border-white/5 p-4 rounded-lg">
            <h4 className="font-medium text-sm text-muted-foreground">Bottom Left Text</h4>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="bottomTextLeftTitle" value={formData.bottomTextLeftTitle} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input name="bottomTextLeftSubtitle" value={formData.bottomTextLeftSubtitle} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-4 border border-white/5 p-4 rounded-lg">
            <h4 className="font-medium text-sm text-muted-foreground">Bottom Right Text</h4>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="bottomTextRightTitle" value={formData.bottomTextRightTitle} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input name="bottomTextRightSubtitle" value={formData.bottomTextRightSubtitle} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onSave(formData)}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AboutEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    introTitle: "Harsh Jeswani",
    introSubtitle: "About",
    introText: "Strategic thinker and creative problem solver.",
    encryptedText: "Building the future through innovation, leadership, and relentless pursuit of excellence.",
    role: "Strategist & Leader",
    focus: "Innovation & Growth",
    location: "Global",
    ...initialData
  });

  useEffect(() => {
    if (initialData) setFormData({ ...formData, ...initialData });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card className="bg-card/50 border-white/5">
      <CardHeader>
        <CardTitle>About Page</CardTitle>
        <CardDescription>Manage the introduction and personal details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Intro Subtitle (Small)</Label>
            <Input name="introSubtitle" value={formData.introSubtitle} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Main Name / Title</Label>
            <Input name="introTitle" value={formData.introTitle} onChange={handleChange} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Primary Description</Label>
          <Textarea name="introText" value={formData.introText} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label>Encrypted Text (Animated)</Label>
          <Textarea name="encryptedText" value={formData.encryptedText} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <Input name="role" value={formData.role} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Focus</Label>
            <Input name="focus" value={formData.focus} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input name="location" value={formData.location} onChange={handleChange} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onSave(formData)}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ContactEditor({ initialData, onSave }: { initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    tagline: "Harsh Jeswani",
    title: "Let's Connect",
    description: "Available for strategic consulting, creative collaborations, and meaningful conversations about design and innovation.",
    socialLinks: [] as SocialLink[],
    ...initialData
  });

  useEffect(() => {
    if (initialData) {
      let socialLinks = Array.isArray(initialData.socialLinks) ? initialData.socialLinks : [];
      
      // Handle backward compatibility: convert old 'email' or 'emails' fields to social links
      if (initialData.email && !socialLinks.some((link: any) => link.platform === "gmail" || link.href?.startsWith("mailto:"))) {
        socialLinks.push({
          platform: "gmail",
          href: `mailto:${initialData.email}`
        });
      } else if (initialData.emails && Array.isArray(initialData.emails) && initialData.emails.length > 0) {
        // Convert emails array to social links if not already converted
        initialData.emails.forEach((email: string) => {
          if (!socialLinks.some((link: any) => link.href === `mailto:${email}`)) {
            socialLinks.push({
              platform: "gmail",
              href: `mailto:${email}`
            });
          }
        });
      }
      
      setFormData({ 
        tagline: "Harsh Jeswani",
        title: "Let's Connect",
        description: "Available for strategic consulting, creative collaborations, and meaningful conversations about design and innovation.",
        ...initialData,
        socialLinks: socialLinks // Override with converted social links
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card className="bg-card/50 border-white/5">
      <CardHeader>
        <CardTitle>Contact Page</CardTitle>
        <CardDescription>Update contact information and social links.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Tagline (Small)</Label>
          <Input name="tagline" value={formData.tagline} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label>Main Title</Label>
          <Input name="title" value={formData.title} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea name="description" value={formData.description} onChange={handleChange} className="h-24" />
        </div>

        <div className="space-y-4 pt-4 border-t border-border/50">
          <SocialLinksEditor
            socialLinks={formData.socialLinks || []}
            onChange={(links) => setFormData({ ...formData, socialLinks: links })}
            title="Social Links & Email Addresses"
            description="Manage all contact links including email addresses and social media. Select 'Gmail' platform for email addresses or choose any other social platform."
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onSave(formData)}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SiteSettingsEditor({ initialData, onSave }: { initialData: any, onSave: (settings: { headerTitle: string; pageTitle: string; faviconUrl: string }) => void }) {
  const [headerTitle, setHeaderTitle] = useState("CINEMATIC STRATEGY");
  const [pageTitle, setPageTitle] = useState("Cinematic Strategy - Strategic Consulting & Creative Direction");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      if (initialData.headerTitle) setHeaderTitle(initialData.headerTitle);
      if (initialData.pageTitle) setPageTitle(initialData.pageTitle);
      if (initialData.faviconUrl) setFaviconUrl(initialData.faviconUrl);
    }
  }, [initialData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ headerTitle, pageTitle, faviconUrl });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-card/50 border-white/5">
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>Manage global site settings like the header title, page title, and favicon.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Header Title</Label>
          <Input 
            value={headerTitle} 
            onChange={(e) => setHeaderTitle(e.target.value)} 
            placeholder="CINEMATIC STRATEGY"
          />
          <p className="text-xs text-muted-foreground">This appears in the top-left corner of the landing page.</p>
        </div>

        <div className="space-y-2">
          <Label>Page Title (Browser Tab)</Label>
          <Input 
            value={pageTitle} 
            onChange={(e) => setPageTitle(e.target.value)} 
            placeholder="Cinematic Strategy - Strategic Consulting & Creative Direction"
          />
          <p className="text-xs text-muted-foreground">This appears in the browser tab title.</p>
        </div>

        <div className="space-y-2">
          <Label>Favicon URL</Label>
          <Input 
            value={faviconUrl} 
            onChange={(e) => setFaviconUrl(e.target.value)} 
            placeholder="https://example.com/favicon.svg or data:image/svg+xml,..."
          />
          <p className="text-xs text-muted-foreground">URL or data URI for the favicon. Leave empty to use default.</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AboutFooterTextEditor() {
  const { data: footerText, isLoading } = useAboutFooterText();
  const { mutate: updateFooterText, isLoading: isSaving } = useUpdateAboutFooterText();
  const [formData, setFormData] = useState({
    createText: "LET'S CREATE",
    togetherText: "TOGETHER",
  });

  useEffect(() => {
    if (footerText) {
      setFormData(footerText);
    }
  }, [footerText]);

  const handleSave = async () => {
    try {
      await updateFooterText(formData);
      toast.success("About footer text updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update footer text");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Page Footer Text</CardTitle>
        <CardDescription>
          Edit the text that appears in the masking animation footer section on the About page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="createText">First Line Text</Label>
          <Input
            id="createText"
            value={formData.createText}
            onChange={(e) => setFormData({ ...formData, createText: e.target.value })}
            placeholder="LET'S CREATE"
          />
        </div>
        <div>
          <Label htmlFor="togetherText">Second Line Text</Label>
          <Input
            id="togetherText"
            value={formData.togetherText}
            onChange={(e) => setFormData({ ...formData, togetherText: e.target.value })}
            placeholder="TOGETHER"
          />
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}