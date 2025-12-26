import { useRef, useEffect } from "react";
import { Mail, Linkedin, Twitter, ArrowUpRight, User, Briefcase, Github, Instagram, Facebook, Youtube, MessageCircle, Send, MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import { usePage } from "@/hooks/use-cms";
import { getPlatformLabel } from "@/lib/social-platforms";
import PillNav from "@/components/PillNav";
import FloatingActionMenu from "@/components/FloatingActionMenu";
import gsap from "gsap";
import { useTheme } from "@/components/providers/ThemeProvider";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

const lineReveal = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const },
};

const Contact = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const pillNavRef = useRef<HTMLDivElement>(null);
  const { data: pageData, isLoading } = usePage("contact");

  // Force dark mode on Contact page
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);
  
  // Only use CMS content when loaded, prevent default text flash
  const content = (pageData as any)?.content ? (pageData as any).content : (
    isLoading 
      ? {
          tagline: "",
          title: "",
          description: "",
          socialLinks: [] as any[],
        }
      : {
          tagline: "Harsh Jeswani",
          title: "Let's Connect",
          description: "Available for strategic consulting, creative collaborations, and meaningful conversations about design and innovation.",
          socialLinks: [] as any[],
        }
  );

  // Map platform names to icons (same as Landing.tsx)
  const getIcon = (platform: string) => {
    const normalized = platform.toLowerCase();
    
    if (normalized === "gmail" || normalized === "email" || normalized.includes("mail")) {
      return Mail;
    }
    if (normalized === "linkedin" || normalized.includes("linkedin")) {
      return Linkedin;
    }
    if (normalized === "twitter" || normalized === "x" || normalized.includes("twitter")) {
      return Twitter;
    }
    if (normalized === "instagram" || normalized.includes("instagram")) {
      return Instagram;
    }
    if (normalized === "github" || normalized.includes("github")) {
      return Github;
    }
    if (normalized === "facebook" || normalized.includes("facebook")) {
      return Facebook;
    }
    if (normalized === "youtube" || normalized.includes("youtube")) {
      return Youtube;
    }
    if (normalized === "discord" || normalized.includes("discord")) {
      return MessageCircle;
    }
    if (normalized === "telegram" || normalized.includes("telegram")) {
      return Send;
    }
    if (normalized === "whatsapp" || normalized.includes("whatsapp")) {
      return MessageSquare;
    }
    return Share2;
  };

  // Get social links from page content only (independent from footer)
  // Handle backward compatibility: convert old 'email' or 'emails' fields
  let pageSocialLinks = content.socialLinks && Array.isArray(content.socialLinks) && content.socialLinks.length > 0
    ? content.socialLinks
    : [];

  // Backward compatibility: if old email field exists, add it as a social link
  if (content.email && !pageSocialLinks.some((link: any) => link.platform === "gmail" || link.href?.startsWith("mailto:"))) {
    pageSocialLinks = [...pageSocialLinks, {
      platform: "gmail",
      href: `mailto:${content.email}`
    }];
  } else if (content.emails && Array.isArray(content.emails) && content.emails.length > 0) {
    // Convert emails array to social links
    content.emails.forEach((email: string) => {
      if (!pageSocialLinks.some((link: any) => link.href === `mailto:${email}`)) {
        pageSocialLinks = [...pageSocialLinks, {
          platform: "gmail",
          href: `mailto:${email}`
        }];
      }
    });
  }

  const allLinks = pageSocialLinks.length > 0
    ? pageSocialLinks.map((link: any) => {
        const IconComponent = getIcon(link.platform);
        const platformLabel = getPlatformLabel(link.platform);
        const isEmail = link.platform === "gmail" || link.href.startsWith("mailto:");
        return {
          icon: IconComponent,
          label: platformLabel,
          href: link.href,
          value: isEmail 
            ? link.href.replace("mailto:", "") // Show email address for email links
            : link.href, // Show URL for social links
        };
      })
    : [];

  // Animate pill navbar from top on mount (Desktop only)
  useEffect(() => {
    if (pillNavRef.current && window.innerWidth >= 768) {
      gsap.set(pillNavRef.current, {
        y: -100,
        opacity: 0,
        visibility: 'visible',
        display: 'block'
      });
      
      gsap.to(pillNavRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.2)",
        delay: 0.3
      });
    } else if (pillNavRef.current) {
      // On mobile, ensure it's completely hidden
      gsap.set(pillNavRef.current, {
        display: 'none',
        visibility: 'hidden',
        opacity: 0
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background text-foreground relative overflow-hidden"
    >
      {/* Floating Action Menu - Mobile Only */}
      <div className="fixed top-4 right-4 z-[60] md:hidden">
        <FloatingActionMenu
          options={[
            {
              label: "Home",
              onClick: () => navigate("/"),
              Icon: <User className="w-4 h-4" />,
            },
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
          ]}
        />
      </div>

      {/* PILL NAV - Appears from top (Desktop Only) */}
      <div ref={pillNavRef} className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto w-full max-w-fit px-4 hidden md:block" style={{ visibility: 'hidden', opacity: 0, display: 'none' }}>
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

      {/* Ambient Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-8 py-24">
        <div className="max-w-4xl w-full">
          {/* Header Section */}
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-block mb-6"
            >
              <span className="text-xs font-body tracking-[0.3em] uppercase text-muted-foreground">
                {content.tagline || (isLoading ? "" : "")}
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-light text-foreground mb-6">
              {content.title ? (
                <>
                  {content.title.split(" ").slice(0, -1).join(" ")} <span className="gradient-text italic">{content.title.split(" ").slice(-1)}</span>
                </>
              ) : (
                <span className="invisible">Let's Connect</span>
              )}
            </h1>
            
            <motion.p
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed"
            >
              {content.description || (isLoading && <span className="invisible">Loading...</span>)}
            </motion.p>
          </motion.div>
          {/* Gradient Divider */}
          <motion.div
            {...lineReveal}
            className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-16 origin-left"
          />
          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {allLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="group relative p-8 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 hover:bg-card/50 transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <link.icon className="w-6 h-6 text-primary" />
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>
                <h3 className="text-lg font-display text-foreground">
                  {link.label}
                </h3>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.a>
            ))}
          </motion.div>
          {/* Gradient Divider */}
          <motion.div
            {...lineReveal}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
            className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-16 origin-right"
          />
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center"
          >
            <p className="text-muted-foreground font-body mb-8 text-lg">
              Prefer a direct approach?
            </p>
            {(() => {
              // Find first email link (Gmail platform or mailto: href)
              const firstEmailLink = allLinks.find((link) => 
                link.href.startsWith("mailto:") || link.icon === Mail
              );
              return firstEmailLink ? (
                <a href={firstEmailLink.href}>
                  <Button
                    variant="cta"
                    size="lg"
                    className="group"
                  >
                    Send an Email
                    <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </a>
              ) : null;
            })()}
          </motion.div>
          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mt-24"
          >
            <p className="text-xs font-body tracking-widest uppercase text-muted-foreground/50">
              Response within 24–48 hours
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;