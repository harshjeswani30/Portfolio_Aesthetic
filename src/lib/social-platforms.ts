// Shared social media platforms configuration
// Used across admin panels and components

export const SOCIAL_PLATFORMS = [
  { value: "gmail", label: "Gmail" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter/X" },
  { value: "instagram", label: "Instagram" },
  { value: "github", label: "GitHub" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "behance", label: "Behance" },
  { value: "dribbble", label: "Dribbble" },
  { value: "medium", label: "Medium" },
  { value: "discord", label: "Discord" },
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "reddit", label: "Reddit" },
  { value: "pinterest", label: "Pinterest" },
  { value: "tiktok", label: "TikTok" },
  { value: "snapchat", label: "Snapchat" },
  { value: "twitch", label: "Twitch" },
] as const;

export type SocialPlatform = typeof SOCIAL_PLATFORMS[number]["value"];

// Helper to get platform label
export function getPlatformLabel(platform: string): string {
  const found = SOCIAL_PLATFORMS.find((p) => p.value === platform.toLowerCase());
  return found?.label || platform.charAt(0).toUpperCase() + platform.slice(1);
}

// Helper to get placeholder URL for a platform
export function getPlatformPlaceholder(platform: string): string {
  const normalized = platform.toLowerCase();
  if (normalized === "gmail" || normalized === "email" || normalized.includes("mail")) {
    return "mailto:your.email@gmail.com";
  }
  return `https://${normalized}.com`;
}

