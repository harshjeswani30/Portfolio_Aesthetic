import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { SOCIAL_PLATFORMS, getPlatformLabel, getPlatformPlaceholder } from "@/lib/social-platforms";

export interface SocialLink {
  platform: string;
  href: string;
}

interface SocialLinksEditorProps {
  socialLinks?: SocialLink[] | null;
  onChange: (links: SocialLink[]) => void;
  title?: string;
  description?: string;
}

export function SocialLinksEditor({
  socialLinks,
  onChange,
  title = "Social Links",
  description = "Manage social media links",
}: SocialLinksEditorProps) {
  // Ensure socialLinks is always an array
  const safeSocialLinks = Array.isArray(socialLinks) ? socialLinks : [];

  const addSocialLink = () => {
    onChange([
      ...safeSocialLinks,
      { platform: "gmail", href: "" },
    ]);
  };

  const removeSocialLink = (index: number) => {
    onChange(safeSocialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (index: number, field: "platform" | "href", value: string) => {
    const updated = [...safeSocialLinks];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={addSocialLink}>
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>

      <div className="space-y-4">
        {safeSocialLinks.map((link, index) => (
          <div key={index} className="flex gap-2 items-end p-4 border border-border/50 rounded-lg bg-card/30">
            <div className="flex-1">
              <Label>Platform</Label>
              <Select
                value={link.platform}
                onValueChange={(value) =>
                  updateSocialLink(index, "platform", value)
                }
              >
                <SelectTrigger className="w-full bg-background border-border">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border shadow-lg z-[9999] max-h-[300px]">
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <SelectItem 
                      key={platform.value} 
                      value={platform.value}
                      className="cursor-pointer hover:bg-accent focus:bg-accent"
                    >
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>URL</Label>
              <Input
                value={link.href}
                onChange={(e) =>
                  updateSocialLink(index, "href", e.target.value)
                }
                placeholder={getPlatformPlaceholder(link.platform)}
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
        {safeSocialLinks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No social links added. Click "Add Link" to add one.
          </p>
        )}
      </div>
    </div>
  );
}

