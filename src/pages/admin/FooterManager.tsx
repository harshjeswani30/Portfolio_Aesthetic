import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";
import { useFooterSettings, useUpdateFooterSettings } from "@/hooks/use-cms";
import { toast } from "sonner";

interface SocialLink {
  platform: string;
  href: string;
  label: string;
}

interface NavLink {
  href: string;
  label: string;
}

interface FooterData {
  brandName: string;
  logoText: string;
  socialLinks: SocialLink[];
  mainLinks: NavLink[];
  legalLinks: NavLink[];
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
    mainLinks: [],
    legalLinks: [],
    copyright: {
      text: "",
      license: "",
    },
  });

  useEffect(() => {
    if (footerData) {
      setFormData(footerData as FooterData);
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

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [
        ...formData.socialLinks,
        { platform: "twitter", href: "", label: "" },
      ],
    });
  };

  const removeSocialLink = (index: number) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.filter((_, i) => i !== index),
    });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...formData.socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, socialLinks: updated });
  };

  const addMainLink = () => {
    setFormData({
      ...formData,
      mainLinks: [...formData.mainLinks, { href: "", label: "" }],
    });
  };

  const removeMainLink = (index: number) => {
    setFormData({
      ...formData,
      mainLinks: formData.mainLinks.filter((_, i) => i !== index),
    });
  };

  const updateMainLink = (index: number, field: keyof NavLink, value: string) => {
    const updated = [...formData.mainLinks];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, mainLinks: updated });
  };

  const addLegalLink = () => {
    setFormData({
      ...formData,
      legalLinks: [...formData.legalLinks, { href: "", label: "" }],
    });
  };

  const removeLegalLink = (index: number) => {
    setFormData({
      ...formData,
      legalLinks: formData.legalLinks.filter((_, i) => i !== index),
    });
  };

  const updateLegalLink = (index: number, field: keyof NavLink, value: string) => {
    const updated = [...formData.legalLinks];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, legalLinks: updated });
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Manage social media links</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addSocialLink}>
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.socialLinks.map((link, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label>Platform</Label>
                <Input
                  value={link.platform}
                  onChange={(e) =>
                    updateSocialLink(index, "platform", e.target.value)
                  }
                  placeholder="twitter"
                />
              </div>
              <div className="flex-1">
                <Label>URL</Label>
                <Input
                  value={link.href}
                  onChange={(e) =>
                    updateSocialLink(index, "href", e.target.value)
                  }
                  placeholder="https://twitter.com"
                />
              </div>
              <div className="flex-1">
                <Label>Label</Label>
                <Input
                  value={link.label}
                  onChange={(e) =>
                    updateSocialLink(index, "label", e.target.value)
                  }
                  placeholder="Twitter"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSocialLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.socialLinks.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No social links added. Click "Add Link" to add one.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Main Navigation Links</CardTitle>
              <CardDescription>Primary navigation links</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addMainLink}>
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.mainLinks.map((link, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label>URL</Label>
                <Input
                  value={link.href}
                  onChange={(e) =>
                    updateMainLink(index, "href", e.target.value)
                  }
                  placeholder="#"
                />
              </div>
              <div className="flex-1">
                <Label>Label</Label>
                <Input
                  value={link.label}
                  onChange={(e) =>
                    updateMainLink(index, "label", e.target.value)
                  }
                  placeholder="Expertise"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeMainLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.mainLinks.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No main links added. Click "Add Link" to add one.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Legal Links</CardTitle>
              <CardDescription>Legal and policy links</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addLegalLink}>
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.legalLinks.map((link, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label>URL</Label>
                <Input
                  value={link.href}
                  onChange={(e) =>
                    updateLegalLink(index, "href", e.target.value)
                  }
                  placeholder="#"
                />
              </div>
              <div className="flex-1">
                <Label>Label</Label>
                <Input
                  value={link.label}
                  onChange={(e) =>
                    updateLegalLink(index, "label", e.target.value)
                  }
                  placeholder="Privacy Policy"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLegalLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.legalLinks.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No legal links added. Click "Add Link" to add one.
            </p>
          )}
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




