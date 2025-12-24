import { EncryptedText } from "@/components/ui/encrypted-text";
import { Link, useLocation } from "react-router";
import DecayCard from "@/components/DecayCard";
import { Suspense, useRef, useState, useEffect, type RefObject } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Timeline } from "@/components/ui/timeline";
import VariableProximity from "@/components/VariableProximity";
import { usePage, useTimeline, useProfileCardSettings, useAboutFooterText } from "@/hooks/use-cms";
import PillNav from "@/components/PillNav";

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
  const [startEncryption, setStartEncryption] = useState(false);

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
    if (!wrapperRef.current || !imageRef.current || !profileCardRef.current || !textContentRef.current || !scrollSpacerRef.current || !timelineRef.current) return;

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
      willChange: "transform, opacity"
    });

    // 2. Reveal Content & Profile Card (After image is cleared)
    // Profile Card Reveal - start from right side
    tl.fromTo(profileCardRef.current, 
      { x: 200, opacity: 0, autoAlpha: 0, scale: 1 },
      { 
        x: 0, opacity: 1, autoAlpha: 1, scale: 1, duration: 0.8, ease: "power2.out",
        onStart: () => setStartEncryption(true),
        onReverseComplete: () => setStartEncryption(false),
        willChange: "transform, opacity"
      },
      "-=0.25" // Start slightly before image is fully gone for smoothness
    );

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

  }, { scope: wrapperRef });

  // Animate pill navbar from top on mount
  useEffect(() => {
    if (pillNavRef.current) {
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
    }
  }, []);

  return (
    <div className="bg-background min-h-screen">
      {/* PILL NAV - Appears from top */}
      <div ref={pillNavRef} className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto w-full max-w-fit px-4" style={{ visibility: 'hidden', opacity: 0 }}>
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
          <div ref={textContentRef} className="relative z-20 w-full h-full flex flex-col justify-center px-8 md:px-20 bg-background/80 backdrop-blur-sm overflow-visible">
            {/* Profile Card - Positioned on Right Side */}
            <div ref={profileCardRef} className="absolute right-0 top-0 bottom-0 z-[25] opacity-0 invisible will-change-[transform,opacity] flex items-center justify-center pr-8 md:pr-20 translate-x-[-40px] md:translate-x-[-60px] w-full md:w-1/2 h-full">
              <Suspense fallback={null}>
                <div className="scale-150 md:scale-[1.8]">
                  <DecayCard 
                    image={profileCardSettings?.cardImageUrl || 'https://picsum.photos/300/400?grayscale'}
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
