import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useFooterSettings, useUpdateFooterSettings } from "@/hooks/use-cms";
import { toast } from "sonner";
import { SocialLinksEditor, type SocialLink } from "@/components/admin/SocialLinksEditor";

interface FooterData {
  brandName: string;
  logoText: string;
  socialLinks: SocialLink[];
  copyright: {
    text: string;
    license?: string;
  };
}

export default function FooterManager() {
  const { data: footerData, isLoading } = useFooterSettings();
  const { mutate: updateFooter, isLoading: isSaving } = useUpdateFooterSettings();
  const [formData, setFormData] = useState<FooterData>({
    brandName: "",
    logoText: "",
    socialLinks: [],
    copyright: {
      text: "",
      license: "",
    },
  });

  useEffect(() => {
    if (footerData) {
      const data = footerData as FooterData;
      setFormData({
        ...data,
        socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : []
      });
    }
  }, [footerData]);

  const handleSave = async () => {
    try {
      await updateFooter(formData);
      toast.success("Footer settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save footer settings");
      console.error(error);
    }
  };

  const handleSocialLinksChange = (links: SocialLink[]) => {
    setFormData({ ...formData, socialLinks: links });
  };

  if (isLoading) {
    return <div className="p-6">Loading footer settings...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Footer Manager</h1>
          <p className="text-muted-foreground mt-1">
            Manage footer content and links
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brand Information</CardTitle>
          <CardDescription>Update brand name and logo text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="brandName">Brand Name</Label>
            <Input
              id="brandName"
              value={formData.brandName}
              onChange={(e) =>
                setFormData({ ...formData, brandName: e.target.value })
              }
              placeholder="Cinematic Strategy"
            />
          </div>
          <div>
            <Label htmlFor="logoText">Logo Text</Label>
            <Input
              id="logoText"
              value={formData.logoText}
              onChange={(e) =>
                setFormData({ ...formData, logoText: e.target.value })
              }
              placeholder="CS"
              maxLength={10}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Manage social media links for footer and contact page</CardDescription>
        </CardHeader>
        <CardContent>
          <SocialLinksEditor
            socialLinks={formData.socialLinks}
            onChange={handleSocialLinksChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Copyright</CardTitle>
          <CardDescription>Copyright text and license information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="copyrightText">Copyright Text</Label>
            <Input
              id="copyrightText"
              value={formData.copyright.text}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  copyright: { ...formData.copyright, text: e.target.value },
                })
              }
              placeholder="© 2024 Cinematic Strategy. All rights reserved."
            />
          </div>
          <div>
            <Label htmlFor="license">License (Optional)</Label>
            <Input
              id="license"
              value={formData.copyright.license || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  copyright: { ...formData.copyright, license: e.target.value },
                })
              }
              placeholder=""
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}






