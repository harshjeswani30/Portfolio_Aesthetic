import { useRef, useState, useEffect, type RefObject } from "react";
import VariableProximity from "@/components/VariableProximity";
import Shuffle from "@/components/Shuffle";
import * as LucideIcons from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useExpertiseCards } from "@/hooks/use-cms";
import PillNav from "@/components/PillNav";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Helper to get icon by name
const getIcon = (name: string) => {
  const Icon = (LucideIcons as any)[name];
  return Icon || LucideIcons.HelpCircle;
};

const Expertise = () => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const pillNavRef = useRef<HTMLDivElement>(null);

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);

  // Fetch data from Supabase
  const { data: expertiseAreas } = useExpertiseCards();

  // Disable scroll when overlay is open
  useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedCard]);

  useGSAP(() => {
    if (!containerRef.current || !expertiseAreas || expertiseAreas.length === 0) return;

    const tl = gsap.timeline();

    // Hero subtitle animation
    if (subtitleRef.current) {
      tl.from(subtitleRef.current, {
        y: 20,
        opacity: 0,
        letterSpacing: "0em",
        duration: 1,
        ease: "power3.out"
      })
      .to(subtitleRef.current, {
        letterSpacing: "0.3em",
        duration: 1.5,
        ease: "power2.out"
      }, "<");
    }

    // Description animation
    if (descriptionRef.current) {
      tl.from(descriptionRef.current, {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8");
    }

    // Line divider animation
    if (lineRef.current) {
      gsap.from(lineRef.current, {
        scrollTrigger: {
          trigger: lineRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
        scaleX: 0,
        duration: 1.5,
        ease: "expo.inOut",
        transformOrigin: "left"
      });
    }

    // Cards stagger animation - visible and animate when scrolling down
    // Wait for cards to render and ensure they exist
    const animateCards = () => {
      const cards = gsap.utils.toArray<HTMLElement>(".expertise-card-wrapper");
      if (cards.length > 0 && cardsRef.current) {
        // Kill any existing animations on these cards to prevent conflicts
        cards.forEach(card => {
          gsap.killTweensOf(card);
          // Set initial hidden state
          gsap.set(card, {
            y: 60,
            opacity: 0,
            scale: 0.9
          });
        });
        
        // Animate cards in when scrolling down
        gsap.to(cards, {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%", // Start animation when section is 80% from top
            end: "top 50%",   // End animation when section is 50% from top
            toggleActions: "play none none reverse",
            once: false, // Allow animation to reverse on scroll up
          },
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: {
            amount: 0.6, // Total stagger duration
            from: "start"
          },
          duration: 0.9,
          ease: "power3.out",
        });
      }
    };
    
    // Try multiple times to ensure cards are rendered (in case data loads slowly)
    setTimeout(animateCards, 100);
    setTimeout(animateCards, 300);
    setTimeout(animateCards, 500);

    // Stats animation
    const statItems = gsap.utils.toArray<HTMLElement>(".stat-item");
    if (statItems.length > 0) {
      gsap.from(statItems, {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      });
    }

    // Stats counter animation
    const stats = [
      { value: 10, suffix: "+", label: "Years Experience" },
      { value: 50, suffix: "+", label: "Projects Delivered" },
      { value: 200, suffix: "%", label: "Average Growth" },
      { value: 15, suffix: "+", label: "Industry Awards" },
    ];

    stats.forEach((stat, i) => {
      const counter = { val: 0 };
      const element = document.getElementById(`stat-val-${i}`);
      if (element) {
        gsap.to(counter, {
          val: stat.value,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          onUpdate: () => {
            element.innerText = Math.floor(counter.val) + stat.suffix;
          }
        });
      }
    });

  }, { scope: containerRef, dependencies: [expertiseAreas] });

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

  const stats = [
    { value: 10, suffix: "+", label: "Years Experience" },
    { value: 50, suffix: "+", label: "Projects Delivered" },
    { value: 200, suffix: "%", label: "Average Growth" },
    { value: 15, suffix: "+", label: "Industry Awards" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-x-hidden">
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

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-6 md:px-12 lg:px-24 min-h-[60vh] flex flex-col justify-center">
        <div className="max-w-5xl">
          <span ref={subtitleRef} className="inline-block text-primary font-body tracking-[0.3em] uppercase text-sm mb-6">
            Our Expertise
          </span>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-light mb-8 leading-[0.9]">
            <Shuffle 
              text="Strategic Mastery" 
              className="text-primary cursor-default block font-display"
              tag="span"
            />
          </h1>

          <VariableProximity 
            ref={descriptionRef}
            label="We combine analytical rigor with creative vision to solve complex challenges and drive meaningful growth for forward-thinking organizations."
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed flex-wrap"
            containerRef={containerRef as RefObject<HTMLElement>}
            fromFontVariationSettings="'wght' 300, 'wdth' 100"
            toFontVariationSettings="'wght' 500, 'wdth' 110"
            radius={100}
            falloff="gaussian"
          />
        </div>

        <div ref={lineRef} className="line-accent w-full mt-24 origin-left" />
      </section>

      {/* Expertise Grid */}
      <section ref={cardsRef} className="px-6 md:px-12 lg:px-24 py-20">
        {!expertiseAreas ? (
          <div className="text-center py-20 text-muted-foreground">Loading expertise...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 overflow-visible">
            {expertiseAreas.map((area: any) => {
              const Icon = getIcon(area.icon);
              const cardId = area.id || area._id || `card-${area.title}`;
              return (
                <div 
                  key={cardId}
                  className="expertise-card-wrapper relative group cursor-pointer overflow-visible"
                  style={{
                    opacity: 0,
                    transform: 'translateY(60px) scale(0.9)',
                    zIndex: hoveredCard === cardId ? 9999 : 'auto'
                  }}
                  onMouseEnter={() => setHoveredCard(cardId)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setSelectedCard(area)}
                >
                  {/* Floating Images on Hover */}
                  <AnimatePresence>
                    {hoveredCard === cardId && area.images && area.images.length >= 2 && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, x: -20, y: -20, rotate: -5 }}
                          animate={{ opacity: 1, scale: 1, x: -40, y: -40, rotate: -10 }}
                          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="absolute -top-10 -left-10 w-32 h-24 rounded-lg overflow-hidden shadow-2xl pointer-events-none hidden md:block"
                          style={{ zIndex: 99999 }}
                        >
                          <img 
                            src={area.images[0]} 
                            alt="" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, x: 20, y: 20, rotate: 5 }}
                          animate={{ opacity: 1, scale: 1, x: 40, y: 40, rotate: 10 }}
                          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                          className="absolute -bottom-10 -right-10 w-28 h-36 rounded-lg overflow-hidden shadow-2xl pointer-events-none hidden md:block"
                          style={{ zIndex: 99999 }}
                        >
                          <img 
                            src={area.images[1]} 
                            alt="" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Card Content */}
                  <div className="relative z-10 h-full p-8 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm transition-all duration-500 group-hover:border-primary/30 group-hover:bg-white/10 overflow-hidden">
                    {/* Hover Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="card-icon-container mb-6 p-4 bg-white/5 rounded-lg w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <Icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                      </div>
                      
                      <h3 className="text-2xl font-display mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                        {area.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-8 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                        {area.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {area.skills.map((skill: string, idx: number) => (
                          <span 
                            key={idx} 
                            className="skill-tag text-xs font-body tracking-wider uppercase px-3 py-1 rounded-full border border-white/10 bg-white/5 text-muted-foreground/60 group-hover:border-primary/30 group-hover:text-primary/80 transition-all duration-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="px-6 md:px-12 lg:px-24 py-20 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-border/30 pt-20">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item text-center md:text-left">
              <div 
                id={`stat-val-${index}`}
                className="text-4xl md:text-6xl font-display text-primary mb-2"
              >
                0{stat.suffix}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest font-body">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedCard && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCard(null)}
              className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-md"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 pointer-events-none"
            >
              <div className="bg-card border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl pointer-events-auto relative flex flex-col md:flex-row">
                
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                >
                  <LucideIcons.X className="w-6 h-6" />
                </button>

                {/* Image Side */}
                <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden bg-gradient-to-br from-primary/10 to-background">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 md:hidden" />
                  {selectedCard.images && selectedCard.images.length > 0 && selectedCard.images[0] ? (
                    <img 
                      src={selectedCard.images[0]} 
                      alt={selectedCard.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-8">
                        {(() => {
                          const Icon = getIcon(selectedCard.icon);
                          return <Icon className="w-16 h-16 text-primary/30 mx-auto mb-4" />;
                        })()}
                        <p className="text-muted-foreground text-sm">No image available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Side */}
                <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-lg text-primary mb-4">
                      {(() => {
                        const Icon = getIcon(selectedCard.icon);
                        return <Icon className="w-6 h-6" />;
                      })()}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display text-foreground mb-2">
                      {selectedCard.title}
                    </h2>
                    <div className="h-1 w-20 bg-primary rounded-full" />
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    {selectedCard.long_description || selectedCard.longDescription}
                  </p>

                  <div className="mt-auto">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                      Key Capabilities
                    </h4>
                    <div className="flex flex-wrap gap-3 mb-8">
                      {selectedCard.skills && selectedCard.skills.length > 0 ? (
                        selectedCard.skills.map((skill: string, idx: number) => (
                          <span 
                            key={idx} 
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground/80"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No skills listed</p>
                      )}
                    </div>

                    <Button onClick={() => setSelectedCard(null)} className="w-full md:w-auto group">
                      Close Details
                      <LucideIcons.ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Expertise;