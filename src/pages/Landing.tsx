import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Footer } from "@/components/ui/footer";
import { Github, Instagram, Linkedin, Mail, Twitter, MousePointer2, User, Briefcase, Facebook, Youtube, MessageCircle, Send, Phone, MessageSquare, Share2 } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router";
import PillNav from "@/components/PillNav";
import { usePage, useSiteSettings, useFooterSettings, useGalleryItems, useGalleryTextSettings, useLogoSettings } from "@/hooks/use-cms";
import { convertDriveUrlToDirectImageUrl } from "@/lib/image-utils";
import HorizontalGallery, { HorizontalGalleryRef } from "@/components/HorizontalGallery";
import { clamp, map } from "@/utils/math";
import FloatingActionMenu from "@/components/FloatingActionMenu";
import OrientationPrompt from "@/components/OrientationPrompt";
import ThemeToggle from "@/components/ThemeToggle";
import ScrollTextMotion from "@/components/ScrollTextMotion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { PrivacyPolicy } from "@/components/legal/PrivacyPolicy";
import { TermsOfService } from "@/components/legal/TermsOfService";

gsap.registerPlugin(ScrollTrigger);

// Helper to check if device is mobile portrait
const isMobilePortrait = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
};

// Footer Content Component
function FooterContent({ footerData, onPrivacyPolicyClick, onTermsOfServiceClick }: { footerData: any; onPrivacyPolicyClick?: () => void; onTermsOfServiceClick?: () => void }) {
  // Default footer data
  const defaultFooter = {
    brandName: "Cinematic Strategy",
    logoText: "CS",
    socialLinks: [
      { platform: "gmail", href: "mailto:example@gmail.com", label: "Gmail" },
      { platform: "linkedin", href: "https://linkedin.com", label: "LinkedIn" },
    ],
    mainLinks: [
      { href: "/about", label: "About" },
      { href: "/expertise", label: "Expertise" },
      { href: "/contact", label: "Contact" },
    ],
    copyright: {
      text: "© 2024 Cinematic Strategy. All rights reserved.",
      license: "",
    },
  };

  const footer = footerData || defaultFooter;
  const { data: logoSettings } = useLogoSettings();

  // Map platform names to icons
  const getIcon = (platform: string) => {
    const normalized = platform.toLowerCase();
    
    // Email/Gmail
    if (normalized === "gmail" || normalized === "email" || normalized.includes("mail")) {
      return <Mail className="h-5 w-5" />;
    }
    
    // Social Media Platforms
    if (normalized === "linkedin" || normalized.includes("linkedin")) {
      return <Linkedin className="h-5 w-5" />;
    }
    
    if (normalized === "twitter" || normalized === "x" || normalized.includes("twitter")) {
      return <Twitter className="h-5 w-5" />;
    }
    
    if (normalized === "instagram" || normalized.includes("instagram")) {
      return <Instagram className="h-5 w-5" />;
    }
    
    if (normalized === "github" || normalized.includes("github")) {
      return <Github className="h-5 w-5" />;
    }
    
    if (normalized === "facebook" || normalized.includes("facebook")) {
      return <Facebook className="h-5 w-5" />;
    }
    
    if (normalized === "youtube" || normalized.includes("youtube")) {
      return <Youtube className="h-5 w-5" />;
    }
    
    if (normalized === "behance" || normalized.includes("behance")) {
      return <Share2 className="h-5 w-5" />;
    }
    
    if (normalized === "dribbble" || normalized.includes("dribbble")) {
      return <Share2 className="h-5 w-5" />;
    }
    
    if (normalized === "medium" || normalized.includes("medium")) {
      return <MessageSquare className="h-5 w-5" />;
    }
    
    if (normalized === "discord" || normalized.includes("discord")) {
      return <MessageCircle className="h-5 w-5" />;
    }
    
    if (normalized === "telegram" || normalized.includes("telegram")) {
      return <Send className="h-5 w-5" />;
    }
    
    if (normalized === "whatsapp" || normalized.includes("whatsapp")) {
      return <MessageSquare className="h-5 w-5" />;
    }
    
    if (normalized === "reddit" || normalized.includes("reddit")) {
      return <MessageCircle className="h-5 w-5" />;
    }
    
    if (normalized === "pinterest" || normalized.includes("pinterest")) {
      return <Share2 className="h-5 w-5" />;
    }
    
    if (normalized === "tiktok" || normalized.includes("tiktok")) {
      return <Share2 className="h-5 w-5" />;
    }
    
    if (normalized === "snapchat" || normalized.includes("snapchat")) {
      return <MessageSquare className="h-5 w-5" />;
    }
    
    if (normalized === "twitch" || normalized.includes("twitch")) {
      return <Youtube className="h-5 w-5" />;
    }
    
    // Default fallback
    return <Share2 className="h-5 w-5" />;
  };

  return (
    <Footer
      logo={
        logoSettings?.logoUrl ? (
          <div className="h-10 w-10 rounded-lg flex items-center justify-center overflow-hidden bg-primary/10 relative">
            <img
              src={convertDriveUrlToDirectImageUrl(logoSettings.logoUrl)}
              alt="Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  const fallback = target.parentElement?.querySelector('.logo-text-fallback') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }
              }}
            />
            <div className="logo-text-fallback hidden h-full w-full bg-primary rounded-lg items-center justify-center text-white font-bold text-sm absolute inset-0">
              {logoSettings?.logoText || footer.logoText || "CS"}
            </div>
          </div>
        ) : (
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            {logoSettings?.logoText || footer.logoText || "CS"}
          </div>
        )
      }
      brandName={footer.brandName || "Cinematic Strategy"}
      socialLinks={footer.socialLinks?.map((link: any) => ({
        icon: getIcon(link.platform),
        href: link.href,
        label: link.label,
      })) || []}
      mainLinks={[
        { href: "/about", label: "About" },
        { href: "/expertise", label: "Expertise" },
        { href: "/contact", label: "Contact" },
      ]}
      onPrivacyPolicyClick={onPrivacyPolicyClick}
      onTermsOfServiceClick={onTermsOfServiceClick}
      copyright={footer.copyright || { text: "" }}
    />
  );
}

// Helper to split text into characters for animation
const CharSplitter = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div className={`inline-flex ${className}`}>
      {text.split("").map((char, index) => (
        <span key={index} className="char inline-block will-change-transform">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const horizontalTextRef = useRef<HTMLDivElement>(null);
  const executionTextRef = useRef<HTMLDivElement>(null);
  const finalVideoRef = useRef<HTMLDivElement>(null);
  const finalVideoElementRef = useRef<HTMLVideoElement>(null);
  const horizontalGalleryRef = useRef<HorizontalGalleryRef>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const pillNavRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [finalVideoLoaded, setFinalVideoLoaded] = useState(false);
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  const [termsOfServiceOpen, setTermsOfServiceOpen] = useState(false);
  const [isMobilePortraitView, setIsMobilePortraitView] = useState(false);
  const finalVideoPausedTimeRef = useRef<number>(0);
  const finalVideoIsPlayingRef = useRef<boolean>(false);
  const heroVideoPausedTimeRef = useRef<number>(0);
  const heroVideoIsPlayingRef = useRef<boolean>(false);
  const { theme, setTheme } = useTheme();

  // Check for mobile portrait view
  useEffect(() => {
    const checkMobilePortrait = () => {
      setIsMobilePortraitView(isMobilePortrait());
    };
    
    checkMobilePortrait();
    window.addEventListener('resize', checkMobilePortrait);
    window.addEventListener('orientationchange', checkMobilePortrait);
    
    return () => {
      window.removeEventListener('resize', checkMobilePortrait);
      window.removeEventListener('orientationchange', checkMobilePortrait);
    };
  }, []);

  // Force hide PillNav on mobile portrait (overrides GSAP animations)
  useEffect(() => {
    if (pillNavRef.current) {
      if (isMobilePortraitView) {
        // Force hide with inline styles (highest priority)
        pillNavRef.current.style.setProperty('display', 'none', 'important');
        pillNavRef.current.style.setProperty('visibility', 'hidden', 'important');
        pillNavRef.current.style.setProperty('opacity', '0', 'important');
        pillNavRef.current.style.setProperty('pointer-events', 'none', 'important');
        // Kill any active GSAP animations
        gsap.killTweensOf(pillNavRef.current);
      } else {
        // Reset styles when not mobile portrait (let GSAP handle it)
        pillNavRef.current.style.removeProperty('display');
        pillNavRef.current.style.removeProperty('visibility');
        pillNavRef.current.style.removeProperty('opacity');
        pillNavRef.current.style.removeProperty('pointer-events');
      }
    }
  }, [isMobilePortraitView]);
  
  // Save landing theme preference when it changes on Landing page
  useEffect(() => {
    if (location.pathname === '/') {
      // Save to both landingTheme (for route restoration) and theme (for ThemeProvider)
      localStorage.setItem('landingTheme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, location.pathname]);

  const { data: pageData } = usePage("home");
  const { data: siteSettings } = useSiteSettings();
  const { data: footerData } = useFooterSettings();
  const { data: galleryItems } = useGalleryItems(false); // Only get active items
  const { data: galleryTextSettings } = useGalleryTextSettings();
  
  const content = (pageData as any)?.content || {
    heroTitle1: "PORT",
    heroTitle2: "FOLIO",
    videoUrl: "https://videos.pexels.com/video-files/5377684/5377684-uhd_2560_1440_25fps.mp4",
    finalVideoUrl: "https://videos.pexels.com/video-files/3222356/3222356-hd_1920_1080_25fps.mp4",
    bottomTextLeftTitle: "CINEMATIC",
    bottomTextLeftSubtitle: "Showreel 2024",
    bottomTextRightTitle: "STRATEGY",
    bottomTextRightSubtitle: "Creative Direction"
  };

  const headerTitle = siteSettings?.headerTitle || "CINEMATIC STRATEGY";

  // Handle final video URL changes and ensure proper loading
  useEffect(() => {
    const videoUrl = content.finalVideoUrl?.trim();
    if (videoUrl && finalVideoElementRef.current) {
      const currentSrc = finalVideoElementRef.current.getAttribute('src') || finalVideoElementRef.current.src;
      // Only reload if URL actually changed
      if (currentSrc !== videoUrl) {
        console.log('Loading final video:', videoUrl);
        finalVideoElementRef.current.src = videoUrl;
        finalVideoElementRef.current.load(); // Force reload video with new URL
        setFinalVideoLoaded(false);
        // Ensure video is visible and paused
        finalVideoElementRef.current.style.display = 'block';
        finalVideoElementRef.current.pause();
        finalVideoIsPlayingRef.current = false;
        finalVideoPausedTimeRef.current = 0;
      }
    } else if (finalVideoElementRef.current) {
      // Ensure video is paused by default
      finalVideoElementRef.current.pause();
      finalVideoIsPlayingRef.current = false;
      finalVideoPausedTimeRef.current = 0;
    }
  }, [content.finalVideoUrl]);

  // Ensure videos start paused on mount
  useEffect(() => {
    if (finalVideoElementRef.current) {
      finalVideoElementRef.current.pause();
      finalVideoIsPlayingRef.current = false;
      finalVideoPausedTimeRef.current = 0;
    }
    if (videoElementRef.current) {
      videoElementRef.current.pause();
      heroVideoIsPlayingRef.current = false;
      heroVideoPausedTimeRef.current = 0;
    }
  }, []);

  useGSAP(() => {
    if (!wrapperRef.current || !headerRef.current || !heroRef.current || !videoRef.current || !horizontalTextRef.current || !executionTextRef.current || !finalVideoRef.current || !horizontalGalleryRef.current?.containerRef.current || !horizontalGalleryRef.current?.contentRef.current || !footerRef.current) return;
    
    // Skip PillNav setup if on mobile portrait
    if (isMobilePortraitView || !pillNavRef.current) {
      return;
    }

    // Set initial state for pillNav (hidden and positioned below)
    if (pillNavRef.current) {
      gsap.set(pillNavRef.current, {
        y: 150,
        opacity: 0,
        autoAlpha: 0,
        visibility: 'hidden',
        display: 'none',
        pointerEvents: 'none'
      });
    }

    // Set initial state for horizontal gallery (hidden below)
    if (horizontalGalleryRef.current?.containerRef.current) {
      gsap.set(horizontalGalleryRef.current.containerRef.current, {
        y: "100%",
        autoAlpha: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
        display: 'block' // Make sure it's display block for transform to work
      });
    }
    
    // Set initial state for footer (hidden below, positioned at top-full)
    if (footerRef.current) {
      gsap.set(footerRef.current, {
        yPercent: 0, // Start at top-full position (0 means at its natural position which is top-full)
        autoAlpha: 1, // Make it visible
        visibility: 'visible',
      });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: "+=15000", // Increased duration to accommodate horizontal gallery (2s hold + 1.5s fade + 12s scroll + 4s footer + buffer)
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Hide scroll indicator when scrolling starts
          if (self.progress > 0.01 && scrollIndicatorRef.current && !hasScrolled) {
            setHasScrolled(true);
            gsap.to(scrollIndicatorRef.current, {
              opacity: 0,
              autoAlpha: 0,
              duration: 0.5,
              ease: "power2.out",
              onComplete: () => {
                if (scrollIndicatorRef.current) {
                  scrollIndicatorRef.current.style.display = 'none';
                }
              }
            });
          }


          // Control video playback based on whether video is in fullscreen
          // Check if we're at or past the end of the video expansion (fullscreen)
          // The video expansion animation starts at "finalScale" label and has duration of 3 seconds
          const finalScaleLabelTime = tl.labels?.finalScale;
          if (finalScaleLabelTime !== undefined && finalVideoElementRef.current && content.finalVideoUrl) {
            const finalScaleAnimationDuration = 3; // Duration of the video expansion animation
            const finalScaleEndTime = finalScaleLabelTime + finalScaleAnimationDuration;
            const currentTime = tl.time();
            const isFullscreen = currentTime >= finalScaleEndTime;
            
            if (isFullscreen) {
              // Video is in fullscreen - play it
              if (!finalVideoIsPlayingRef.current) {
                if (finalVideoPausedTimeRef.current > 0) {
                  finalVideoElementRef.current.currentTime = finalVideoPausedTimeRef.current;
                }
                finalVideoElementRef.current.play().catch((err) => {
                  console.warn('Failed to play final video:', err);
                });
                finalVideoIsPlayingRef.current = true;
              }
            } else {
              // Video is not in fullscreen - pause it and save time
              if (finalVideoIsPlayingRef.current) {
                finalVideoPausedTimeRef.current = finalVideoElementRef.current.currentTime;
                finalVideoElementRef.current.pause();
                finalVideoIsPlayingRef.current = false;
              } else {
                // Make sure video is paused when not in fullscreen
                if (!finalVideoElementRef.current.paused) {
                  finalVideoElementRef.current.pause();
                }
              }
            }
          } else if (finalVideoElementRef.current && content.finalVideoUrl) {
            // If label not available yet or before fullscreen phase, ensure video is paused
            if (!finalVideoElementRef.current.paused) {
              finalVideoElementRef.current.pause();
              finalVideoIsPlayingRef.current = false;
            }
          }

          // Control EXECUTION text visibility - hide once video starts expanding (at finalScale label)
          if (finalScaleLabelTime !== undefined && executionTextRef.current) {
            const currentTime = tl.time();
            const isAtOrPastFinalScale = currentTime >= finalScaleLabelTime;
            
            if (isAtOrPastFinalScale) {
              // Once video expansion starts, keep text hidden (don't let it fade back in on reverse)
              gsap.set(executionTextRef.current, { autoAlpha: 0 });
            }
          }

          // Control hero video playback based on whether video is in fullscreen
          // The hero video fullscreen animation starts at "fullscreen" label and has duration of 4 seconds
          const fullscreenLabelTime = tl.labels?.fullscreen;
          if (fullscreenLabelTime !== undefined && videoElementRef.current && content.videoUrl) {
            const fullscreenAnimationDuration = 4; // Duration of the hero video fullscreen animation
            const fullscreenEndTime = fullscreenLabelTime + fullscreenAnimationDuration;
            const currentTime = tl.time();
            const isHeroFullscreen = currentTime >= fullscreenEndTime;
            
            if (isHeroFullscreen) {
              // Hero video is in fullscreen - play it
              if (!heroVideoIsPlayingRef.current) {
                if (heroVideoPausedTimeRef.current > 0) {
                  videoElementRef.current.currentTime = heroVideoPausedTimeRef.current;
                }
                videoElementRef.current.play().catch((err) => {
                  console.warn('Failed to play hero video:', err);
                });
                heroVideoIsPlayingRef.current = true;
              }
            } else {
              // Hero video is not in fullscreen - pause it and save time
              if (heroVideoIsPlayingRef.current) {
                heroVideoPausedTimeRef.current = videoElementRef.current.currentTime;
                videoElementRef.current.pause();
                heroVideoIsPlayingRef.current = false;
              } else {
                // Make sure video is paused when not in fullscreen
                if (!videoElementRef.current.paused) {
                  videoElementRef.current.pause();
                }
              }
            }
          } else if (videoElementRef.current && content.videoUrl) {
            // If label not available yet or before fullscreen phase, ensure video is paused
            if (!videoElementRef.current.paused) {
              videoElementRef.current.pause();
              heroVideoIsPlayingRef.current = false;
            }
          }

        }
      }
    });

    // --- HERO PHASE ---
    
    // Header Animation (Moves up slowly as scroll starts)
    tl.to(headerRef.current, { yPercent: -100, duration: 3, ease: "power3.inOut" }, "start");

    // 1. Split Text & Video Appear (Scale 0 -> 1)
    tl.to(".port-text", { x: -250, duration: 2, ease: "power3.out" }, "start")
      .to(".folio-text", { x: 250, duration: 2, ease: "power3.out" }, "start")
      .fromTo(videoRef.current, 
        { scale: 0, autoAlpha: 0, width: "20rem", height: "11.25rem", borderRadius: "1rem" },
        { scale: 1, autoAlpha: 1, duration: 2, ease: "power3.out" },
        "start"
      );

    // 2. Video Fullscreen & Text Exit
    // Video playback is controlled by ScrollTrigger onUpdate callback
    tl.to(videoRef.current, {
      width: "100vw",
      height: "100vh",
      borderRadius: "0rem",
      duration: 4,
      ease: "expo.inOut"
    }, "fullscreen")
    .to(".port-text", { x: -800, autoAlpha: 0, duration: 4, ease: "expo.inOut" }, "fullscreen")
    .to(".folio-text", { x: 800, autoAlpha: 0, duration: 4, ease: "expo.inOut" }, "fullscreen")
    .to(".bottom-text", { autoAlpha: 1, duration: 2 }, "fullscreen+=2"); // Reveal bottom text as video becomes fullscreen

    // 3. Hold / Pin Video (Simulated Pin)
    // This creates the "pin for 2 seconds" feel before fading
    tl.to({}, { duration: 4 });

    // 4. Fade Out Video & Hero Background
    // This reveals the horizontal section which is sitting behind (z-0)
    tl.to([videoRef.current, ".bottom-text", ".hero-bg"], { autoAlpha: 0, duration: 2 }, "fade");

    // --- HORIZONTAL PHASE ---
    
    // Re-select chars to include new subtext characters
    const chars = horizontalTextRef.current.querySelectorAll(".char");
    
    // Calculate scroll distance to center the final video card
    // The container has pl-[100vw] and pr-[calc(50vw-10rem)]
    // We want to scroll to the very end to center the last element
    const getScrollDist = () => {
      if (!horizontalTextRef.current) return 0;
      return -(horizontalTextRef.current.scrollWidth - window.innerWidth);
    };

    // Horizontal Scroll
    // Moves the text from right to left until the video card is centered
    tl.to(horizontalTextRef.current, {
      x: getScrollDist,
      ease: "none",
      duration: 10 
    }, "horizontal");

    // Character Animations (Linked to horizontal scroll timing)
    // Simulating the "random" effect as they appear
    tl.from(chars, {
      yPercent: () => gsap.utils.random(-200, 200),
      rotation: () => gsap.utils.random(-20, 20),
      opacity: 0,
      duration: 2,
      ease: "back.out(1.2)",
      stagger: {
        amount: 8, // Spread the animation across the scroll duration
        from: "start"
      }
    }, "horizontal");

    // --- FINAL VIDEO EXPANSION PHASE ---
    
    // Fade out EXECUTION text when video starts expanding to fullscreen
    tl.to(executionTextRef.current, {
      autoAlpha: 0,
      duration: 1.5,
      ease: "power2.inOut"
    }, "finalScale");

    // Upscale the final video card to fullscreen
    tl.to(finalVideoRef.current, {
      scale: () => {
        // Calculate scale to cover full viewport
        // Base size: 20rem (320px) x 11.25rem (180px)
        const videoWidth = 320; 
        const videoHeight = 180;
        const scaleX = window.innerWidth / videoWidth; // Full width for fullscreen
        const scaleY = window.innerHeight / videoHeight;
        return Math.max(scaleX, scaleY) * 1.05; // Slightly less margin
      },
      x: 0, // Center the video (no offset)
      borderRadius: 0,
      duration: 3,
      ease: "expo.inOut"
    }, "finalScale");

    // --- HORIZONTAL GALLERY PHASE ---
    
    // 1. Hold the fullscreen video for 2 seconds (starts after finalScale animation completes)
    tl.to({}, { duration: 2 }, "finalScale+=3");

    // 2. Fade out final video first (starts after hold period)
    tl.to(finalVideoRef.current, {
      autoAlpha: 0,
      duration: 1.5,
      ease: "power2.inOut"
    }, "finalScale+=5"); // Start after finalScale (3s) + hold (2s) = 5s

    // 3. Slide up horizontal gallery smoothly after video fades out
    tl.fromTo(
      horizontalGalleryRef.current.containerRef.current,
      { y: "100%", autoAlpha: 0, pointerEvents: 'none' },
      { 
        y: "0%", 
        autoAlpha: 1, 
        duration: 2, 
        ease: "power3.inOut", 
        pointerEvents: 'auto',
        onStart: () => {
          if (horizontalGalleryRef.current?.containerRef.current) {
            horizontalGalleryRef.current.containerRef.current.style.visibility = 'visible';
          }
          // Gallery is now visible
        }
      },
      "finalScale+=6.5" // Start after finalScale (3s) + hold (2s) + fade (1.5s) = 6.5s
    );

    // 4. Horizontal scroll animation through gallery items (starts after slide up)
    const galleryContent = horizontalGalleryRef.current.contentRef.current;
    const imageInnerRefs = horizontalGalleryRef.current.imageInnerRefs.current;
    const itemRefs = horizontalGalleryRef.current.itemRefs.current;
    const titleRefs = horizontalGalleryRef.current.titleRefs.current;
    const startTextRefs = horizontalGalleryRef.current.startTextRefs.current;
    const endTextRefs = horizontalGalleryRef.current.endTextRefs.current;
    
    const getHorizontalScrollDist = () => {
      if (!galleryContent) return 0;
      const contentWidth = galleryContent.scrollWidth;
      const viewportWidth = window.innerWidth;
      // Calculate scroll distance to show the end text completely, then stop
      // We want to scroll just enough to show all content including the end text
      const scrollDistance = -(contentWidth - viewportWidth);
      return scrollDistance;
    };

    // Horizontal scroll animation - starts after slide up animation completes (2s duration)
    // Calculate duration based on content width to ensure smooth scrolling
    const getScrollDuration = () => {
      if (!galleryContent) return 12;
      const contentWidth = galleryContent.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = contentWidth - viewportWidth;
      // Calculate duration based on distance (roughly 100px per second for smooth scroll)
      const baseDuration = Math.max(8, (scrollDistance / 100) * 0.8);
      return Math.min(baseDuration, 15); // Cap at 15 seconds
    };
    
    const horizontalScrollDuration = getScrollDuration();
    
    tl.to(galleryContent, {
      x: getHorizontalScrollDist,
      ease: "none",
      duration: horizontalScrollDuration, // Dynamic duration based on content
      onUpdate: function() {
        if (!galleryContent) return;
        
        // Calculate horizontal scroll progress (0 to 1)
        const currentX = Math.abs(gsap.getProperty(galleryContent, "x") as number);
        const maxX = Math.abs(getHorizontalScrollDist());
        const scrollProgress = maxX > 0 ? currentX / maxX : 0;
        
        // Calculate vertical parallax offset based on horizontal scroll
        // The parallax effect should be relative to viewport center during horizontal scroll
        const viewportHeight = window.innerHeight;
        const parallaxRange = viewportHeight * 0.3; // Maximum parallax movement
        
        // Apply parallax to gallery items (alternating speeds: 2 and -2)
        if (itemRefs && itemRefs.length > 0) {
          itemRefs.forEach((itemEl, index) => {
            if (!itemEl) return;
            const speed = index % 2 === 0 ? 2 : -2;
            // Calculate parallax based on element's horizontal position relative to viewport
            const rect = itemEl.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const centerX = viewportWidth / 2;
            const elementCenterX = rect.left + rect.width / 2;
            const horizontalProgress = 1 - Math.abs(elementCenterX - centerX) / (viewportWidth / 2);
            const yOffset = speed * parallaxRange * horizontalProgress * 0.1;
            gsap.set(itemEl, { y: yOffset });
          });
        }
        
        // Apply parallax to image inners (speed: 1)
        if (imageInnerRefs && imageInnerRefs.length > 0) {
          imageInnerRefs.forEach((imgEl) => {
            if (!imgEl) return;
            
            // Calculate progress based on element's position relative to viewport center
            const rect = imgEl.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const centerX = viewportWidth / 2;
            const elementCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(elementCenterX - centerX);
            const maxDistance = viewportWidth / 2 + rect.width / 2;
            const progress = clamp(1 - (distance / maxDistance), 0, 1);
            
            // Vertical parallax (speed: 1)
            const speed = 1;
            const horizontalProgress = progress;
            const yOffset = speed * parallaxRange * horizontalProgress * 0.1;
            gsap.set(imgEl, { y: yOffset });
            
            // Apply saturate and brightness based on progress (same logic as Locomotive Scroll Demo 5)
            const saturateVal = progress < 0.5 
              ? clamp(map(progress, 0, 0.5, 0, 1), 0, 1) 
              : clamp(map(progress, 0.5, 1, 1, 0), 0, 1);
            const brightnessVal = progress < 0.5 
              ? clamp(map(progress, 0, 0.5, 0, 1), 0, 1) 
              : clamp(map(progress, 0.5, 1, 1, 0), 0, 1);
            
            imgEl.style.filter = `saturate(${saturateVal}) brightness(${brightnessVal})`;
          });
        }
        
        // Apply parallax to titles (speed: 1)
        if (titleRefs && titleRefs.length > 0) {
          titleRefs.forEach((titleEl) => {
            if (!titleEl) return;
            const speed = 1;
            const rect = titleEl.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const centerX = viewportWidth / 2;
            const elementCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(elementCenterX - centerX);
            const maxDistance = viewportWidth / 2 + rect.width / 2;
            const horizontalProgress = clamp(1 - (distance / maxDistance), 0, 1);
            const yOffset = speed * parallaxRange * horizontalProgress * 0.1;
            gsap.set(titleEl, { y: yOffset });
          });
        }
        
        // Apply parallax to start text (speeds: 3 and -4)
        if (startTextRefs && startTextRefs.length >= 2) {
          if (startTextRefs[0]) {
            const rect = startTextRefs[0].getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const centerX = viewportWidth / 2;
            const elementCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(elementCenterX - centerX);
            const maxDistance = viewportWidth / 2 + rect.width / 2;
            const horizontalProgress = clamp(1 - (distance / maxDistance), 0, 1);
            const yOffset = 3 * parallaxRange * horizontalProgress * 0.1;
            gsap.set(startTextRefs[0], { y: yOffset });
          }
          if (startTextRefs[1]) {
            const rect = startTextRefs[1].getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const centerX = viewportWidth / 2;
            const elementCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(elementCenterX - centerX);
            const maxDistance = viewportWidth / 2 + rect.width / 2;
            const horizontalProgress = clamp(1 - (distance / maxDistance), 0, 1);
            const yOffset = -4 * parallaxRange * horizontalProgress * 0.1;
            gsap.set(startTextRefs[1], { y: yOffset });
          }
        }
        
        // Apply parallax to end text (speeds: -4 and 3)
        if (endTextRefs && endTextRefs.length >= 2) {
          if (endTextRefs[0]) {
            const rect = endTextRefs[0].getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const centerX = viewportWidth / 2;
            const elementCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(elementCenterX - centerX);
            const maxDistance = viewportWidth / 2 + rect.width / 2;
            const horizontalProgress = clamp(1 - (distance / maxDistance), 0, 1);
            const yOffset = -4 * parallaxRange * horizontalProgress * 0.1;
            gsap.set(endTextRefs[0], { y: yOffset });
          }
          if (endTextRefs[1]) {
            const rect = endTextRefs[1].getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const centerX = viewportWidth / 2;
            const elementCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(elementCenterX - centerX);
            const maxDistance = viewportWidth / 2 + rect.width / 2;
            const horizontalProgress = clamp(1 - (distance / maxDistance), 0, 1);
            const yOffset = 3 * parallaxRange * horizontalProgress * 0.1;
            gsap.set(endTextRefs[1], { y: yOffset });
          }
        }
      }
    }, "finalScale+=8.5"); // Start after finalScale (3s) + hold (2s) + fade (1.5s) + slide up (2s) = 8.5s

    // --- FOOTER REVEAL PHASE ---
    
    // Footer appears immediately after horizontal scroll completes (no extra scrolling)
    // Calculate the exact end time: finalScale (3s) + hold (2s) + fade (1.5s) + slide up (2s) + horizontal scroll duration
    const footerStartTime = 8.5 + horizontalScrollDuration;

    tl.to(footerRef.current, {
      yPercent: -100, // Move up by its own height (it's placed at top: 100%)
      duration: 1, // Faster reveal since no extra scrolling needed
      ease: "power2.inOut"
    }, `finalScale+=${footerStartTime}`);

    // 3. PillNav appears together with footer (slight delay for smoother animation)
    // Only animate if not on mobile portrait
    if (!isMobilePortraitView && pillNavRef.current) {
      tl.to(pillNavRef.current, {
        y: 0,
        opacity: 1,
        autoAlpha: 1,
        duration: 0.6,
        ease: "back.out(1.2)",
        onStart: () => {
          // Check current state before setting (mobile portrait might have changed)
          if (pillNavRef.current && !isMobilePortrait()) {
            gsap.set(pillNavRef.current, {
              visibility: 'visible',
              display: 'block',
              pointerEvents: 'auto'
            });
          }
        },
        onReverseComplete: () => {
          // Check current state before setting (mobile portrait might have changed)
          if (pillNavRef.current && !isMobilePortrait()) {
            gsap.set(pillNavRef.current, {
              visibility: 'hidden',
              display: 'none',
              y: 150,
              opacity: 0,
              autoAlpha: 0,
              pointerEvents: 'none'
            });
          }
        }
      }, `finalScale+=${footerStartTime + 0.3}`); // Start slightly after footer starts (0.3s delay)
    }

  }, { scope: wrapperRef });

  // Cleanup ScrollTrigger when navigating away to prevent reverse animations
  useEffect(() => {
    // Only cleanup if we're navigating away from the landing page
    if (location.pathname !== '/') {
      // Kill all ScrollTrigger instances immediately
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars?.trigger === wrapperRef.current) {
          st.kill();
        }
      });
      // Also kill any GSAP timelines
        const galleryContainer = horizontalGalleryRef.current?.containerRef.current;
        const elementsToKill = [wrapperRef.current, headerRef.current, heroRef.current, videoRef.current, horizontalTextRef.current, executionTextRef.current, finalVideoRef.current, galleryContainer, footerRef.current];
        if (pillNavRef.current) {
          elementsToKill.push(pillNavRef.current);
        }
        gsap.killTweensOf(elementsToKill);
    }
    
    return () => {
      // Cleanup on unmount
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars?.trigger === wrapperRef.current) {
          st.kill();
        }
      });
        const galleryContainer = horizontalGalleryRef.current?.containerRef.current;
        const elementsToKill = [wrapperRef.current, headerRef.current, heroRef.current, videoRef.current, horizontalTextRef.current, executionTextRef.current, finalVideoRef.current, galleryContainer, footerRef.current];
        if (pillNavRef.current) {
          elementsToKill.push(pillNavRef.current);
        }
        gsap.killTweensOf(elementsToKill);
    };
  }, [location.pathname]);

  // Animate scroll indicator (bouncing mouse animation)
  useEffect(() => {
    if (scrollIndicatorRef.current && !hasScrolled) {
      const scrollDot = scrollIndicatorRef.current.querySelector('.scroll-dot');
      if (scrollDot) {
        const animation = gsap.to(scrollDot, {
          y: 8,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true
        });

        return () => {
          animation.kill();
        };
      }
    }
  }, [hasScrolled]);

  // Also listen to wheel and touch events as fallback
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasScrolled && scrollIndicatorRef.current) {
        setHasScrolled(true);
        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            if (scrollIndicatorRef.current) {
              scrollIndicatorRef.current.style.display = 'none';
            }
          }
        });
      }
    };

    window.addEventListener('wheel', handleInteraction, { passive: true, once: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true, once: true });

    return () => {
      window.removeEventListener('wheel', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasScrolled]);

  return (
    <div className="bg-background min-h-screen text-foreground overflow-x-hidden">
      {/* Orientation Prompt for Mobile */}
      <OrientationPrompt />
      
      {/* Header */}
      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6 md:px-12 text-foreground pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <span className="text-sm sm:text-base md:text-lg font-bold truncate max-w-[200px] sm:max-w-none" style={{ fontFamily: "'Kola-Regular', sans-serif", letterSpacing: '0.15em' }}>{headerTitle}</span>
          <ThemeToggle />
        </div>

        <nav className="flex items-center gap-4 sm:gap-6 md:gap-8 pointer-events-auto">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-foreground">
            <Link to="/about" className="hover:opacity-80 transition-opacity">ABOUT</Link>
            <Link to="/expertise" className="hover:opacity-80 transition-opacity">EXPERTISE</Link>
            <Link to="/contact" className="hover:opacity-80 transition-opacity">CONTACT</Link>
          </div>
        </nav>
      </header>

      {/* MAIN PINNED WRAPPER */}
      <div ref={wrapperRef} className="relative w-full h-screen overflow-hidden">
        
        {/* HORIZONTAL SECTION (Behind Hero) */}
        <div className="absolute inset-0 z-0 flex items-center bg-background">
           <div ref={horizontalTextRef} className="flex gap-[15vw] pl-[100vw] pr-[calc(50vw-10rem)] w-max items-center will-change-transform">
             
             <div className="flex flex-col gap-4">
               <CharSplitter text="STRATEGY" className="text-[8vw] font-bold leading-none text-foreground/90" />
               <CharSplitter text="Defining the path forward" className="text-xl md:text-3xl text-muted-foreground tracking-widest uppercase font-light" />
             </div>

             <div className="flex flex-col gap-4">
               <CharSplitter text="LEADERSHIP" className="text-[8vw] font-bold leading-none text-foreground/90" />
               <CharSplitter text="Guiding with vision" className="text-xl md:text-3xl text-muted-foreground tracking-widest uppercase font-light" />
             </div>

             <div ref={executionTextRef} className="flex flex-col gap-4">
               <CharSplitter text="EXECUTION" className="text-[8vw] font-bold leading-none text-foreground/90" />
               <CharSplitter text="Delivering results" className="text-xl md:text-3xl text-muted-foreground tracking-widest uppercase font-light" />
             </div>

             <div 
               ref={finalVideoRef}
               className="relative w-[20rem] h-[11.25rem] bg-black rounded-xl overflow-hidden shadow-2xl shrink-0 origin-center will-change-transform"
             >
              {content.finalVideoUrl ? (
               <video
                 ref={finalVideoElementRef}
                  key={content.finalVideoUrl} // Force re-render when URL changes
                  src={content.finalVideoUrl.trim()}
                 className="w-full h-full object-cover opacity-90"
                 muted
                 playsInline
                 loop
                 preload="auto"
                 // Removed crossOrigin - causes CORS errors for external videos unless server supports it
                 onError={(e) => {
                    console.error('Final video error:', e);
                    // Don't hide the video, just log the error
                    const videoEl = e.currentTarget;
                    if (videoEl) {
                      videoEl.style.opacity = '0.5';
                    }
                  }}
                   onLoadedData={() => {
                     console.log('Final video loaded successfully');
                     setFinalVideoLoaded(true);
                     if (finalVideoElementRef.current) {
                       finalVideoElementRef.current.style.opacity = '1';
                       finalVideoElementRef.current.style.display = 'block';
                       // Ensure video is paused when loaded
                       finalVideoElementRef.current.pause();
                       finalVideoIsPlayingRef.current = false;
                     }
                   }}
                   onCanPlay={() => {
                   if (finalVideoElementRef.current) {
                       finalVideoElementRef.current.style.opacity = '1';
                       finalVideoElementRef.current.style.display = 'block';
                       // Ensure video is paused when it can play (before fullscreen)
                       if (!finalVideoIsPlayingRef.current) {
                         finalVideoElementRef.current.pause();
                       }
                   }
                 }}
               />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                   No video URL provided
                 </div>
               )}
             </div>

           </div>
        </div>

        {/* HORIZONTAL GALLERY SECTION */}
          <HorizontalGallery
          ref={horizontalGalleryRef}
          startText={galleryTextSettings?.startText || { first: 'Ariel', second: 'Croze' }}
          endText={galleryTextSettings?.endText || { first: 'Daria', second: 'Gaita' }}
            items={(galleryItems || []).map((item: any) => ({
              id: item.id,
              title: item.title, // This will be displayed where tags were
              number: item.number,
              image: item.image,
              tags: [] // Tags are no longer used, but keeping for type compatibility
            }))}
        />

        {/* Scroll Text Motion Background Effect */}
        <ScrollTextMotion isActive={!hasScrolled} />

        {/* HERO SECTION (Front) */}
        <div ref={heroRef} className="absolute inset-0 z-10 flex items-center justify-center">
          {/* Hero Background - Fades out to reveal horizontal section */}
          <div className="hero-bg absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 z-0" />
          <div className="hero-bg absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 pointer-events-none" />

          {/* Video Container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div
              ref={videoRef}
              className="video-container bg-black overflow-hidden shadow-2xl opacity-0 will-change-[width,height,transform,opacity]"
            >
              <video
                ref={videoElementRef}
                src={content.videoUrl}
                className="w-full h-full object-cover opacity-80"
                muted
                playsInline
                loop
                preload="auto"
                  onError={(e) => {
                    // Silently handle video errors - just hide the video
                    if (videoElementRef.current) {
                      videoElementRef.current.style.display = 'none';
                    }
                  }}
                onLoadedData={() => {
                  console.log('Hero video loaded successfully');
                  if (videoElementRef.current) {
                    videoElementRef.current.style.opacity = '1';
                    // Ensure video is paused when loaded
                    videoElementRef.current.pause();
                    heroVideoIsPlayingRef.current = false;
                  }
                }}
                onCanPlay={() => {
                  if (videoElementRef.current) {
                    videoElementRef.current.style.opacity = '1';
                    // Ensure video is paused when it can play (before fullscreen)
                    if (!heroVideoIsPlayingRef.current) {
                      videoElementRef.current.pause();
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex items-center justify-center gap-4 z-[20] pointer-events-none">
            <h1 className="port-text text-6xl md:text-9xl font-bold tracking-tighter text-foreground will-change-transform" style={{ fontFamily: "'Striper-Regular', sans-serif" }}>
              {content.heroTitle1}
            </h1>
            <h1 className="folio-text text-6xl md:text-9xl font-bold tracking-tighter text-foreground will-change-transform" style={{ fontFamily: "'Striper-Regular', sans-serif" }}>
              {content.heroTitle2}
            </h1>
          </div>

          {/* Bottom Text Overlays */}
          <div className="bottom-text opacity-0 absolute bottom-12 left-6 md:left-12 z-[50] pointer-events-none">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{content.bottomTextLeftTitle}</h3>
            <p className="text-sm text-foreground/80 tracking-widest uppercase mt-1">{content.bottomTextLeftSubtitle}</p>
          </div>
            <div className="bottom-text opacity-0 absolute bottom-12 right-6 md:right-12 z-[20] text-right pointer-events-none">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{content.bottomTextRightTitle}</h3>
            <p className="text-sm text-foreground/80 tracking-widest uppercase mt-1">{content.bottomTextRightSubtitle}</p>
          </div>

          {/* Scroll Indicator */}
          {!hasScrolled && (
            <div 
              ref={scrollIndicatorRef}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[20] flex flex-col items-center gap-2 pointer-events-none"
            >
              <MousePointer2 className="w-6 h-6 text-foreground/80" />
              <div className="w-6 h-10 border-2 border-foreground/60 rounded-full flex items-start justify-center p-1.5">
                <div className="scroll-dot w-1.5 h-1.5 bg-foreground/80 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER SECTION */}
        <div ref={footerRef} className="absolute top-full left-0 right-0 w-full z-40 bg-background">
          <FooterContent 
            footerData={footerData} 
            onPrivacyPolicyClick={() => setPrivacyPolicyOpen(true)}
            onTermsOfServiceClick={() => setTermsOfServiceOpen(true)}
          />
        </div>

        {/* PILL NAV - Appears after footer (hidden on mobile portrait only) */}
        <div 
          ref={pillNavRef} 
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-fit px-4"
          style={{
            display: isMobilePortraitView ? 'none' : undefined,
            visibility: isMobilePortraitView ? 'hidden' : undefined,
            opacity: isMobilePortraitView ? 0 : undefined,
            pointerEvents: isMobilePortraitView ? 'none' : undefined,
          }}
        >
          <PillNav
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Expertise', href: '/expertise' },
              { label: 'Contact', href: '/contact' }
            ]}
            activeHref={location.pathname}
            baseColor="hsl(20 8% 6%)"
            pillColor="hsl(34 36% 91%)"
            hoveredPillTextColor="hsl(34 36% 91%)"
            pillTextColor="hsl(20 8% 6%)"
            initialLoadAnimation={false}
          />
        </div>

      </div>

      {/* Mobile Portrait Floating Action Menu - Fixed Position */}
      {isMobilePortraitView && (
        <div className="fixed top-6 right-6 z-[9999] md:hidden">
          <FloatingActionMenu
            options={[
              {
                label: "About",
                onClick: () => navigate("/about"),
                Icon: <User className="w-4 h-4" />,
              },
              {
                label: "Expertise",
                onClick: () => navigate("/expertise"),
                Icon: <Briefcase className="w-4 h-4" />,
              },
              {
                label: "Contact",
                onClick: () => navigate("/contact"),
                Icon: <Mail className="w-4 h-4" />,
              },
            ]}
          />
        </div>
      )}

      {/* Legal Overlays */}
      <PrivacyPolicy 
        open={privacyPolicyOpen} 
        onOpenChange={setPrivacyPolicyOpen} 
      />
      <TermsOfService 
        open={termsOfServiceOpen} 
        onOpenChange={setTermsOfServiceOpen} 
      />
    </div>
  );
}