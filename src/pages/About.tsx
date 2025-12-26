import { EncryptedText } from "@/components/ui/encrypted-text";
import { Link, useLocation, useNavigate } from "react-router";
import DecayCard from "@/components/DecayCard";
import { Suspense, useRef, useState, useEffect, type RefObject } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { convertDriveUrlToDirectImageUrl } from "@/lib/image-utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Timeline } from "@/components/ui/timeline";
import VariableProximity from "@/components/VariableProximity";
import { usePage, useTimeline, useProfileCardSettings, useAboutFooterText } from "@/hooks/use-cms";
import PillNav from "@/components/PillNav";
import FloatingActionMenu from "@/components/FloatingActionMenu";
import { User, Briefcase, Mail } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const isMobile = useIsMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollSpacerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const pillNavRef = useRef<HTMLDivElement>(null);
  const profileCardInnerRef = useRef<HTMLDivElement>(null);
  const [startEncryption, setStartEncryption] = useState(false);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [maskingComplete, setMaskingComplete] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const [overlayDismissed, setOverlayDismissed] = useState(false);

  // Check for mobile landscape and portrait view
  useEffect(() => {
    const checkMobileView = () => {
      if (typeof window === 'undefined') return;
      
      const isMobileDevice = window.innerWidth <= 768;
      const isLandscape = window.innerHeight < window.innerWidth;
      const isPortrait = window.innerHeight >= window.innerWidth;
      setIsMobileLandscape(isMobileDevice && isLandscape);
      setIsMobilePortrait(isMobileDevice && isPortrait);
    };

    // Check immediately
    checkMobileView();
    
    // Check after a small delay to ensure window is ready
    const timeoutId = setTimeout(checkMobileView, 100);
    
    window.addEventListener('resize', checkMobileView);
    window.addEventListener('orientationchange', checkMobileView);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkMobileView);
      window.removeEventListener('orientationchange', checkMobileView);
    };
  }, []);

  const navigate = useNavigate();
  
  // Fetch Page Content
  const { data: pageData } = usePage("about");
  const pageContent = pageData ? ((pageData as any).content) : null;
  const content = (pageContent || {
    introTitle: "Harsh Jeswani",
    introSubtitle: "About",
    introText: "Strategic thinker and creative problem solver.",
    encryptedText: "Building the future through innovation, leadership, and relentless pursuit of excellence.",
    role: "Strategist & Leader",
    focus: "Innovation & Growth",
    location: "Global"
  }) as {
    introTitle: string;
    introSubtitle: string;
    introText: string;
    encryptedText: string;
    role: string;
    focus: string;
    location: string;
  };

  // Fetch Timeline Data
  const { data: timelineEntries } = useTimeline();
  
  // Fetch Profile Card Settings
  const { data: profileCardSettings } = useProfileCardSettings();
  
  // Fetch About Footer Text
  const { data: aboutFooterText } = useAboutFooterText();
  const footerText = aboutFooterText || { createText: "LET'S CREATE", togetherText: "TOGETHER" };
  
  // Debug logging
  useEffect(() => {
    if (profileCardSettings) {
      console.log('Profile Card Settings:', profileCardSettings);
    }
  }, [profileCardSettings]);
  
  const infoCards = [
    { label: "Role", value: content.role },
    { label: "Focus", value: content.focus },
    { label: "Location", value: content.location },
  ];

  // Transform timeline entries for the component
  const timelineData = (timelineEntries || []).map((entry: any) => ({
    title: entry.year || '',
    content: (
      <div>
        <h4 className="text-primary font-bold mb-2 text-lg">{entry.title || ''}</h4>
        <div className="text-muted-foreground text-sm md:text-base whitespace-pre-wrap mb-4">
          {typeof entry.content === 'string' ? entry.content : JSON.stringify(entry.content || '')}
        </div>
        {entry.images && Array.isArray(entry.images) && entry.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {entry.images.map((image: string, idx: number) => (
              <img
                key={idx}
                src={image}
                alt={`${entry.title || 'Timeline'} - Image ${idx + 1}`}
                className="w-full h-auto rounded-lg object-cover border border-border/50"
              />
            ))}
          </div>
        )}
      </div>
    ),
  }));

  useGSAP(() => {
    if (!wrapperRef.current || !imageRef.current || !textContentRef.current || !scrollSpacerRef.current || !timelineRef.current) return;

    // For mobile portrait, create a simple masking animation and track completion
    if (isMobilePortrait) {
      // Kill any existing ScrollTriggers for this trigger
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === scrollSpacerRef.current || st.vars?.trigger === scrollSpacerRef.current) {
          st.kill();
        }
      });

      // Create a simple timeline for masking animation
      const maskTl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSpacerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
          invalidateOnRefresh: true,
        }
      });

      // Masking Animation (Image Zoom & Fade Out)
      maskTl.to(imageRef.current, {
        scale: 3,
        z: 500,
        opacity: 0,
        transformOrigin: "center center",
        ease: "power2.inOut",
        duration: 1,
        willChange: "transform, opacity"
      });

      // Animate text elements to slide up smoothly (mobile portrait)
      const textElements = gsap.utils.toArray<HTMLElement>(".animate-text");
      if (textElements.length > 0) {
        // Calculate when the last element finishes animating
        const totalStaggerTime = (textElements.length - 1) * 0.15;
        const totalAnimationTime = 1 + totalStaggerTime;
        
        maskTl.fromTo(
          textElements,
          { y: 80, opacity: 0, autoAlpha: 0 },
          {
            y: 0,
            opacity: 1,
            autoAlpha: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
            willChange: "transform, opacity"
          },
          "-=0.5" // Start slightly before masking completes
        );
        
        // Set intro visible after all text animations complete, with smooth delay
        maskTl.call(() => {
          setTimeout(() => {
            setIntroVisible(true);
          }, 300);
        }, [], `+=${totalAnimationTime - 1}`);
      } else {
        // If no text elements, set intro visible after masking starts
        maskTl.call(() => {
          setTimeout(() => {
            setIntroVisible(true);
          }, 300);
        }, [], "-=0.5");
      }

      // Track when masking animation completes (at 50% progress) - works in reverse too
      const progressTrigger = ScrollTrigger.create({
        trigger: scrollSpacerRef.current,
        start: "top top",
        end: "+=50%",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.progress >= 0.5) {
            setMaskingComplete(true);
            setStartEncryption(true);
          } else {
            setMaskingComplete(false);
            setStartEncryption(false);
          }
        },
        onEnter: () => {
          setMaskingComplete(true);
          setStartEncryption(true);
        },
        onLeaveBack: () => {
          setMaskingComplete(false);
          setStartEncryption(false);
          setIntroVisible(false);
        }
      });

      // Hold phase after masking
      maskTl.to({}, { duration: 1.5 });

      // Fade out wrapper and fade in timeline (mobile portrait)
      maskTl.to(wrapperRef.current, {
        opacity: 0,
        autoAlpha: 0,
        duration: 1,
        ease: "power2.inOut",
        pointerEvents: "none",
        willChange: "opacity"
      });

      // Fade in timeline
      maskTl.fromTo(
        timelineRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          willChange: "transform, opacity"
        },
        "<" // Start at the same time as wrapper fade out
      );

      return () => {
        // Cleanup on unmount or dependency change
        if (progressTrigger) progressTrigger.kill();
      };
    }

    // Set profile card to visible and fixed position in mobile landscape
    if (isMobileLandscape && profileCardRef.current) {
      gsap.set(profileCardRef.current, {
        x: 20,
        opacity: 1,
        autoAlpha: 1,
        visibility: 'visible',
      });
      if (profileCardInnerRef.current) {
        // Kill any existing animations
        gsap.killTweensOf(profileCardInnerRef.current);
        gsap.set(profileCardInnerRef.current, {
          scale: 0.2, // Smaller scale for mobile landscape (20%)
          force3D: true,
          immediateRender: true
        });
        // Also set inline style directly as backup
        profileCardInnerRef.current.style.setProperty('transform', 'scale(0.2)', 'important');
        profileCardInnerRef.current.style.setProperty('-webkit-transform', 'scale(0.2)', 'important');
        console.log('Mobile landscape in useGSAP: Applied scale 0.2');
      }
      setStartEncryption(true);
    } else if (!isMobileLandscape && profileCardInnerRef.current) {
      // Desktop: clear all GSAP transforms so CSS classes can work
      gsap.killTweensOf(profileCardInnerRef.current);
      gsap.set(profileCardInnerRef.current, {
        clearProps: "all",
      });
      profileCardInnerRef.current.style.removeProperty('transform');
      profileCardInnerRef.current.style.removeProperty('-webkit-transform');
    }

    // Disable scroll animation for mobile landscape - keep profile card fixed and small
    if (isMobileLandscape) {
      // Kill any existing ScrollTriggers
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === scrollSpacerRef.current) {
          st.kill();
        }
      });
      return; // Exit early for mobile landscape - don't create timeline
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSpacerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      }
    });

    // 1. Masking Animation (Image Zoom & Fade Out)
    tl.to(imageRef.current, {
      scale: 3,
      z: 500, // Move towards camera
      opacity: 0, // Fade out to reveal content
      transformOrigin: "center center",
      ease: "power2.inOut",
      duration: 1,
      willChange: "transform, opacity",
      onUpdate: function() {
        // Track progress - when animation is 50% complete, masking is done
        if (this.progress() >= 0.5) {
          setMaskingComplete(true);
        } else {
          setMaskingComplete(false);
        }
      },
      onComplete: () => {
        setMaskingComplete(true);
      },
      onReverseComplete: () => {
        setMaskingComplete(false);
      }
    });

    // 2. Reveal Content & Profile Card (After image is cleared)
    // Profile Card Reveal - start from right side (skip animation in mobile landscape)
    if (!isMobileLandscape) {
      // For desktop, ensure inner card uses CSS classes, not GSAP scale
      const innerCard = profileCardRef.current?.querySelector('div');
      if (innerCard) {
        gsap.killTweensOf(innerCard);
        gsap.set(innerCard, {
          clearProps: "all",
        });
      }
      
      tl.fromTo(profileCardRef.current, 
        { x: 200, opacity: 0, autoAlpha: 0 },
        { 
          x: 0, opacity: 1, autoAlpha: 1, duration: 0.8, ease: "power2.out",
          onStart: () => setStartEncryption(true),
          onReverseComplete: () => setStartEncryption(false),
          willChange: "transform, opacity"
        },
        "-=0.25" // Start slightly before image is fully gone for smoothness
      );
    }

    // Text Reveal (Staggered)
    const textElements = gsap.utils.toArray(".animate-text");
    tl.fromTo(textElements, 
      { y: 30, opacity: 0, autoAlpha: 0 },
      { y: 0, opacity: 1, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: "power2.out", willChange: "transform, opacity" },
      "<" // Sync with Profile Card reveal
    );

    // 3. Hold Phase (2 seconds equivalent in scroll distance)
    tl.to({}, { duration: 1.5 });

    // 4. Fade Out Main Frame (Intro & Profile Card)
    // Completely fade out the wrapper to reveal the timeline underneath
    tl.to(wrapperRef.current, {
      opacity: 0,
      autoAlpha: 0,
      duration: 1,
      ease: "power2.inOut",
      pointerEvents: "none", // Ensure clicks go through to timeline
      willChange: "opacity"
    });
    
    // Fade In Timeline (Cross-fade)
    // We animate the timeline container to fade in and slide up slightly
    tl.fromTo(timelineRef.current, 
      { opacity: 0, y: 100 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", willChange: "transform, opacity" }, 
      "<" // Start at the same time as wrapper fade out
    );

  }, { scope: wrapperRef, dependencies: [isMobileLandscape, isMobilePortrait] });

  // Ensure mobile landscape scale persists even if timeline tries to interfere
  useEffect(() => {
    if (!isMobileLandscape || !profileCardInnerRef.current) return;

    // Set up an interval to re-apply scale if it gets overridden
    const interval = setInterval(() => {
      if (profileCardInnerRef.current) {
        const currentTransform = window.getComputedStyle(profileCardInnerRef.current).transform;
        const currentScale = parseFloat(currentTransform.match(/matrix.*\(([^)]+)\)/)?.[1]?.split(',')[0] || '1');
        
        // If scale is not 0.2, re-apply it
        if (Math.abs(currentScale - 0.2) > 0.1) {
          gsap.set(profileCardInnerRef.current, {
            scale: 0.2,
            force3D: true,
            immediateRender: true
          });
          profileCardInnerRef.current.style.setProperty('transform', 'scale(0.2)', 'important');
          profileCardInnerRef.current.style.setProperty('-webkit-transform', 'scale(0.2)', 'important');
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isMobileLandscape]);

  // Update profile card scale when mobile landscape changes
  useEffect(() => {
    console.log('Profile card scale useEffect triggered', { isMobileLandscape, hasRef: !!profileCardInnerRef.current });
    
    if (!profileCardInnerRef.current) {
      // Retry after a short delay if ref is not ready
      const timer = setTimeout(() => {
        if (profileCardInnerRef.current) {
          const innerCard = profileCardInnerRef.current;
          
          if (isMobileLandscape) {
            console.log('Applying scale 0.2 (delayed)');
            gsap.killTweensOf(innerCard);
            gsap.set(innerCard, {
              scale: 0.2,
              force3D: true,
              immediateRender: true
            });
            innerCard.style.setProperty('transform', 'scale(0.2) !important');
            innerCard.style.setProperty('-webkit-transform', 'scale(0.2) !important');
            innerCard.style.setProperty('transform-origin', 'center center');
            
            // Force a reflow
            innerCard.offsetHeight;
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    
    const innerCard = profileCardInnerRef.current;
    
    // Kill any existing animations first
    gsap.killTweensOf(innerCard);
    
    if (isMobileLandscape) {
      // Mobile landscape: apply small scale via GSAP AND inline style
      gsap.set(innerCard, {
        scale: 0.2,
        force3D: true,
        immediateRender: true
      });
      // Also set inline style directly as backup (with !important)
      innerCard.style.setProperty('transform', 'scale(0.2) !important');
      innerCard.style.setProperty('-webkit-transform', 'scale(0.2) !important');
      innerCard.style.setProperty('transform-origin', 'center center');
      
      // Force a reflow to ensure styles are applied
      innerCard.offsetHeight;
      
      // Log computed style to verify
      const computed = window.getComputedStyle(innerCard);
      console.log('Mobile landscape: Applied scale 0.2 to profile card', {
        transform: computed.transform,
        width: computed.width,
        height: computed.height
      });
    } else {
      // Desktop: clear all GSAP transforms and inline styles so CSS classes can work
      gsap.set(innerCard, {
        clearProps: "all",
      });
      innerCard.style.removeProperty('transform');
      innerCard.style.removeProperty('-webkit-transform');
      innerCard.style.removeProperty('transform-origin');
      console.log('Desktop: Cleared GSAP transforms, using CSS classes');
    }
  }, [isMobileLandscape]);

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
    <div className="bg-background min-h-screen">
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

      {/* Fixed Intro Section - Full Screen */}
      <div ref={wrapperRef} className="fixed inset-0 z-50 w-full h-screen overflow-visible bg-background will-change-opacity">
        {/* Content Section - Full Screen Introduction with Card */}
        <div ref={contentRef} className="content relative w-full h-full z-10 overflow-visible">
          {/* Main Content - Full Width Section with Card */}
          <div 
            ref={textContentRef} 
            className="relative z-20 w-full h-full flex flex-col justify-center px-8 md:px-20 bg-background/80 backdrop-blur-sm overflow-visible"
            style={{
              paddingTop: isMobilePortrait ? '8rem' : undefined,
            }}
          >
            {/* Profile Card - Positioned on Right Side (Desktop & Mobile Landscape) */}
            <div ref={profileCardRef} className={`absolute right-0 top-0 bottom-0 z-[25] flex items-center justify-center will-change-[transform,opacity] ${isMobilePortrait ? 'hidden' : isMobileLandscape ? 'opacity-100 visible pr-0 translate-x-[20px]' : 'opacity-0 invisible pr-8 md:pr-20 translate-x-[-40px] md:translate-x-[-60px]'} w-full md:w-1/2 h-full`}>
              <Suspense fallback={null}>
                <div 
                  ref={profileCardInnerRef}
                  className={isMobileLandscape ? "!scale-[0.2]" : "scale-150 md:scale-[1.8]"}
                  style={isMobileLandscape ? { 
                    transform: 'scale(0.2) !important',
                    WebkitTransform: 'scale(0.2) !important',
                    MozTransform: 'scale(0.2) !important',
                    msTransform: 'scale(0.2) !important',
                    OTransform: 'scale(0.2) !important',
                    transformOrigin: 'center center !important'
                  } : undefined}
                >
                  <DecayCard 
                    image={profileCardSettings?.cardImageUrl ? convertDriveUrlToDirectImageUrl(profileCardSettings.cardImageUrl) : 'https://picsum.photos/300/400?grayscale'}
                    width={isMobileLandscape ? 200 : 300}
                    height={isMobileLandscape ? 267 : 400}
                  />
                </div>
              </Suspense>
            </div>
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-8 text-left">
                  <div className="space-y-2 animate-text opacity-0 invisible will-change-[transform,opacity]">
                    <span className="text-sm font-body tracking-widest uppercase text-muted-foreground">{content.introSubtitle}</span>
                    <h1 className="text-6xl md:text-8xl font-display font-bold text-primary tracking-tight whitespace-nowrap">
                      {content.introTitle}
                    </h1>
                  </div>
                  
                  <div className="space-y-6 max-w-2xl animate-text opacity-0 invisible will-change-[transform,opacity]">
                    <p className="text-2xl md:text-3xl font-light text-foreground/80">
                      {content.introText}
                    </p>
                    
                    <div className="text-lg md:text-xl leading-relaxed font-light text-muted-foreground">
                      <EncryptedText 
                        text={content.encryptedText}
                        encryptedClassName="text-muted-foreground/30"
                        revealedClassName="text-foreground"
                        revealDelayMs={30}
                        animate={startEncryption}
                      />
                    </div>
                  </div>

                  {/* Info Cards - Horizontal Layout */}
                  <div className="flex flex-nowrap gap-4 mt-4 overflow-x-auto pb-2 md:overflow-visible no-scrollbar animate-text opacity-0 invisible will-change-[transform,opacity]">
                    {infoCards.map((card, index) => (
                      <div key={index} className="group p-4 border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-colors duration-300 min-w-[140px] shrink-0">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{card.label}</h3>
                        <p className="text-lg font-display text-foreground group-hover:text-primary transition-colors whitespace-nowrap">{card.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Profile Card - Below Info Cards (Mobile Portrait Only) */}
                  {isMobilePortrait && (
                    <div 
                      className="flex justify-end items-center mb-8 w-full pr-6"
                      style={{ 
                        transform: introVisible 
                          ? 'translateY(-24px) translateX(8px) scale(1)' 
                          : 'translateY(40px) translateX(8px) scale(0.95)',
                        willChange: 'transform, opacity',
                        opacity: introVisible ? 1 : 0,
                        transition: 'opacity 0.6s ease-out, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                        pointerEvents: introVisible ? 'auto' : 'none',
                      }}
                    >
                      <Suspense fallback={null}>
                        <div 
                          className="relative w-full max-w-[380px]" 
                          style={{ 
                            transform: 'none',
                            willChange: 'auto',
                          }}
                        >
                          <DecayCard 
                            image={profileCardSettings?.cardImageUrl ? convertDriveUrlToDirectImageUrl(profileCardSettings.cardImageUrl) : 'https://picsum.photos/300/400?grayscale'}
                            width={380}
                            height={507}
                          />
                          {/* Overlay Text - Click to dismiss */}
                          {!overlayDismissed && (
                            <div 
                              onClick={() => setOverlayDismissed(true)}
                              className="absolute inset-0 flex items-center justify-center cursor-pointer group transition-all duration-500 z-10 rounded-lg"
                              style={{ pointerEvents: 'auto' }}
                            >
                              <div className="text-center px-6 py-4 transform transition-transform duration-300 group-hover:scale-105">
                                <p className="text-white text-sm md:text-base font-medium tracking-[0.15em] uppercase letter-spacing-wider opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                  Click in the black area
                                </p>
                                <div className="w-16 h-px bg-white/70 mx-auto mt-4 opacity-0 animate-[fadeIn_0.8s_ease-out_0.4s_forwards]"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Suspense>
                    </div>
                  )}
                </div>
              </div>
          </div>
        </div>

        {/* Image Overlay */}
        <div className="image-container absolute inset-0 z-[60] w-full h-full overflow-hidden pointer-events-none" style={{ perspective: "500px" }}>
          <img 
            ref={imageRef}
            src="https://assets-global.website-files.com/63ec206c5542613e2e5aa784/643312a6bc4ac122fc4e3afa_main%20home.webp" 
            alt="overlay" 
            className="w-full h-full object-cover object-center will-change-transform"
          />
        </div>
      </div>

      {/* Scroll Spacer to drive the fixed animation */}
      <div ref={scrollSpacerRef} className="w-full h-[250vh]" />

      {/* Timeline Section */}
      <div ref={timelineRef} className="relative z-10 bg-background opacity-0 will-change-[transform,opacity]">
        <Timeline data={timelineData} />
        
        {/* Creative Ending */}
        <div ref={footerRef} className="w-full py-32 md:py-48 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            
            <p className="text-muted-foreground text-xs md:text-sm uppercase tracking-[0.3em] mb-12 animate-pulse">The Journey Continues</p>
            
            <Link to="/contact" className="relative z-10 group flex flex-col items-center">
              <VariableProximity
                label={footerText.createText || "LET'S CREATE"}
                className="text-5xl md:text-8xl lg:text-9xl font-display font-bold text-primary cursor-pointer transition-colors duration-500 text-center leading-tight tracking-tighter"
                fromFontVariationSettings="'wght' 400, 'wdth' 100"
                toFontVariationSettings="'wght' 900, 'wdth' 125"
                radius={300}
                falloff="gaussian"
                containerRef={footerRef as RefObject<HTMLElement>}
              />
              <VariableProximity
                label={footerText.togetherText || "TOGETHER"}
                className="text-5xl md:text-8xl lg:text-9xl font-display font-bold text-primary cursor-pointer transition-colors duration-500 text-center leading-tight tracking-tighter"
                fromFontVariationSettings="'wght' 400, 'wdth' 100"
                toFontVariationSettings="'wght' 900, 'wdth' 125"
                radius={300}
                falloff="gaussian"
                containerRef={footerRef as RefObject<HTMLElement>}
              />
              <div className="h-px w-0 group-hover:w-full bg-primary transition-all duration-500 mx-auto mt-4" />
            </Link>

            <div className="mt-24 flex flex-col items-center gap-4 opacity-60 hover:opacity-100 transition-opacity duration-500">
               <div className="font-display italic text-2xl md:text-3xl text-muted-foreground">{content.introTitle}</div>
               <div className="text-[10px] uppercase tracking-widest text-muted-foreground/50">{content.role}</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;
